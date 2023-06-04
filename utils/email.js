const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url, body, attachments) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.id = user.id;
    this.from = `Mohanraj G <${process.env.EMAIL_FROM}>`;
    if (attachments) this.attachments = attachments;
    if (body) this.body = body;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });
  }

  //FIXME: make only one send class for both features

  async send(template, subject) {
    // 1.Render template from pug
    const html = pug.renderFile(
      `${__dirname}/../views/email/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );
    // console.log(html);
    // 2. Define Options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };
    // 3. Create a transport and send Mail
    await this.newTransport().sendMail(mailOptions);
  }

  async sendArticle(template, subject) {
    // 1.Render template from pug
    const html = pug.renderFile(
      `${__dirname}/../views/email/${template}.pug`,
      {
        firstName: this.firstName,
        subject,
        url: this.url,
        user: this.id,
        body: this.body,
      }
    );
    // console.log(html);
    // 2. Define Options
    const mailOptions = {
      from: this.from,
      to: `${process.env.EMAIL_FROM}`,
      subject,
      html,
      attachments: this.attachments,
      text: htmlToText.fromString(html),
    };
    // 3. Create a transport and send Mail
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the Natours Family");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Reset your password link valid for 10 minutes only!"
    );
  }

  async sendPost() {
    await this.sendArticle(
      "userPost",
      "You received new Article from User"
    );
  }
};
