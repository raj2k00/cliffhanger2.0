/*eslint-disable*/
import axios from "axios";
import { showAlert } from "./alert";

export const forgetPassword = async (email) => {
  try {
    const res = await axios({
      method: "POST",
      url: `http://127.0.0.1:3000/api/v1/users/forgotPassword`,
      data: {
        email,
      },
    });
    if (res.data.status === "success") {
      showAlert(
        "success",
        "Please Check Your Email to Reset Password"
      );
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};
