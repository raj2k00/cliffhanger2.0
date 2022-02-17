import axios from "axios";
import { showAlert } from "./alert";

export const resetPassword = async (
  token,
  password,
  passwordConfirm
) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `http://127.0.0.1:3000/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === "success") {
      showAlert(
        "success",
        "Password Reset successfully, Try Login Again"
      );
      window.setTimeout(() => {
        location.assign("/login");
      }, 1500);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
    // console.log(error.response.data.message);
  }
};
