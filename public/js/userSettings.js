/*eslint-disable*/
import axios from "axios";
import { showAlert } from "./alert";

// data is object from form data , type is either "password" or "data"
export const updateProfile = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "/api/v1/users/updatePassword"
        : "/api/v1/users/updateProfile";

    const res = await axios({
      method: "PATCH",
      url,
      data,
    });
    if (res.data.status === "success") {
      showAlert(
        "success",
        `${type.toUpperCase()} updated Successfully!`
      );
      window.setTimeout(() => {
        location.assign("/profile");
      }, 1000);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};
