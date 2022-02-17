/* eslint-disable */
import { login, logout } from "./login";
import { signup } from "./signup";
import { updateProfile } from "./userSettings";
import { postArticle } from "./compose";
import { deletePost } from "./deletePost";
import { forgetPassword } from "./forgetPassword";
import { resetPassword } from "./resetPassword";
import { sendPost } from "./userArticle";

//DOM VALUES
//FOR ELEMENTS/ANIMATIONS
const navAnimate = document.querySelector(".Sandwitch-Icon");
const toggleIcon = document.getElementById("toggle-icon");
const navmain = document.getElementById("nav-menus");
const mainNav = document.getElementById("nav-bar");
const buttons = document.querySelectorAll("[data-carousel-button]");

//FOR FUNCTIONS/SUBMITIONS
const loginForm = document.querySelector(".login-form");
const logoutBtn = document.querySelector(".nav-link--logout");
const signupBtn = document.querySelector(".signup--form ");
const uploadBtn = document.querySelector(".form-userArticle");
const forgetBtn = document.querySelector(".form-forgetPassword ");
const resetBtn = document.querySelector(".user-resetPassword");
const updateUser = document.querySelector(".updateProfile");
const updatePassword = document.querySelector(".updatePassword");
const composeArticle = document.querySelector(".formComposePost");
const deleteArticle = document.querySelector(".tooltip-delete");

//DELEGATION

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

if (signupBtn) {
  signupBtn.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm =
      document.getElementById("confirmPassword").value;
    signup(name, email, password, passwordConfirm);
  });
}

if (deleteArticle) {
  deleteArticle.addEventListener("click", () => {
    const postId = document.querySelector(".post-Id").textContent;
    deletePost(postId);
  });
}

if (forgetBtn) {
  forgetBtn.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.querySelector(".btn-send--recovery ");
    btn.textContent = "Sending...";
    btn.disable = true;
    btn.classList.add("btn-disabled");
    const email = document.getElementById("email").value;
    // console.log(email);
    await forgetPassword(email);
    btn.textContent = "Send Again";
    btn.disable = false;
    btn.classList.remove("btn-disabled");
  });
}

if (resetBtn) {
  resetBtn.addEventListener("submit", (e) => {
    e.preventDefault();
    const token = document.getElementById("token").textContent;
    const password = document.getElementById("password").value;
    const passwordConfirm =
      document.getElementById("confirmPassword").value;
    resetPassword(token, password, passwordConfirm);
  });
}
if (updateUser) {
  updateUser.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("photo", document.getElementById("image").files[0]);
    updateProfile(form, "data");
  });
}

if (updatePassword) {
  updatePassword.addEventListener("submit", async (e) => {
    e.preventDefault();
    btn = document.querySelector(".btn-save--password");
    btn.textContent = "Updating...";
    btn.classList.add("btn-disabled");
    const password = document.getElementById("password").value;
    const newPassword = document.getElementById("newPassword").value;
    const passwordConfirm =
      document.getElementById("confirmPassword").value;
    await updateProfile(
      { password, newPassword, passwordConfirm },
      "password"
    );
    document.querySelector(".btn-save--password").textContent =
      "Change Again";
    btn.classList.remove("btn-disabled");
    document.getElementById("password").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";
  });
}

if (navAnimate) {
  navAnimate.addEventListener("click", (e) => {
    navmain.classList.toggle("fade-animate");
    navmain.classList.toggle("nav-onclick");

    if (toggleIcon.classList.contains("fa-bars")) {
      toggleIcon.classList.remove("fa-bars");
      toggleIcon.classList.add("fa-times");
    } else {
      toggleIcon.classList.add("fa-bars");
      toggleIcon.classList.remove("fa-times");
    }
  });
}

if (composeArticle) {
  composeArticle.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("author", document.getElementById("userid").value);
    form.append("title", document.getElementById("heading").value);
    form.append(
      "abstract",
      document.getElementById("subheading").value
    );
    form.append(
      "typeFace",
      document.getElementById("typeFace").value
    );
    form.append(
      "category",
      document.getElementById("select-tag").value
    );

    let tagArray = [];
    let science = document.getElementById("checkbox1");
    if (science.checked) {
      tagArray.push(science.value);
    }
    let technology = document.getElementById("checkbox2");
    if (technology.checked) {
      tagArray.push(technology.value);
    }
    let gaming = document.getElementById("checkbox3");
    if (gaming.checked) {
      tagArray.push(gaming.value);
    }
    let entertainment = document.getElementById("checkbox4");
    if (entertainment.checked) {
      tagArray.push(entertainment.value);
    }
    let programming = document.getElementById("checkbox5");
    if (programming.checked) {
      tagArray.push(programming.value);
    }
    let movies = document.getElementById("checkbox6");
    if (movies.checked) {
      tagArray.push(movies.value);
    }
    let anime = document.getElementById("checkbox7");
    if (anime.checked) {
      tagArray.push(anime.value);
    }
    let computer = document.getElementById("checkbox8");
    if (computer.checked) {
      tagArray.push(computer.value);
    }
    let events = document.getElementById("checkbox9");
    if (events.checked) {
      tagArray.push(events.value);
    }
    // console.log(tagArray);
    tagArray.forEach((element) => {
      form.append("tags", element);
    });

    form.append(
      "markdown",
      document.getElementById("markdown").value
    );
    form.append(
      "imageCover",
      document.getElementById("image").files[0]
    );
    // Form type will be either Publish or Update
    const formType =
      document.querySelector(".form-submit").textContent;
    // Selecting Id for Updating Article
    const id = document.querySelector(".post-Id").textContent;
    // console.log(id);

    postArticle(form, formType, id);
  });
}

if (uploadBtn) {
  uploadBtn.addEventListener("submit", async (e) => {
    e.preventDefault();
    const sendBtn = document.getElementById("js_send");
    sendBtn.textContent = "Sending...";
    sendBtn.disabled = true;
    sendBtn.classList.add("btn-disabled");
    const form = new FormData();

    form.append("title", document.getElementById("topic").value);

    const imgs = document.getElementById("image").files.length;
    for (let i = 0; i < imgs; i++) {
      form.append(
        "images",
        document.getElementById("image").files[i]
      );
    }

    form.append("abstract", document.getElementById("heading").value);
    form.append(
      "markdown",
      document.getElementById("mark-down").value
    );
    await sendPost(form);
    sendBtn.classList.remove("btn-disabled");
    sendBtn.textContent = "Send Again!";
    sendBtn.disabled = false;
  });
}

if (document.querySelector(".carousel-ul-list") != null) {
  document
    .querySelector(".carousel-ul-list")
    .firstElementChild.setAttribute("data-active", "");
}

if (buttons) {
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const offset =
        button.dataset.carouselButton === "next" ? 1 : -1;
      const slides = button
        .closest("[data-carousel]")
        .querySelector("[data-slides]");

      const activeSlide = slides.querySelector("[data-active]");
      let newIndex =
        [...slides.children].indexOf(activeSlide) + offset;
      if (newIndex < 0) newIndex = slides.children.length - 1;
      if (newIndex >= slides.children.length) newIndex = 0;

      slides.children[newIndex].dataset.active = true;
      delete activeSlide.dataset.active;
    });
  });
}

if (mainNav) {
  window.addEventListener("DOMContentLoaded", () => {
    let scrollPos = 0;
    const headerHeight = mainNav.clientHeight;
    window.addEventListener("scroll", function () {
      const currentTop =
        document.body.getBoundingClientRect().top * -1;
      if (currentTop < scrollPos) {
        // Scrolling Up
        if (
          currentTop > 0 &&
          mainNav.classList.contains("is-fixed")
        ) {
          mainNav.classList.add("is-visible");
        } else {
          mainNav.classList.remove("is-visible", "is-fixed");
        }
      } else {
        // Scrolling Down
        mainNav.classList.remove(["is-visible"]);
        if (
          currentTop > headerHeight &&
          !mainNav.classList.contains("is-fixed")
        ) {
          mainNav.classList.add("is-fixed");
        }
        navmain.classList.remove("nav-onclick");
        toggleIcon.classList.add("fa-bars");
      }
      scrollPos = currentTop;
    });
  });
}
