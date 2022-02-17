/*eslint-disable*/
import axios from "axios";
import { showAlert } from "./alert";

export const postArticle = async (data, type, id) => {
  try {
    const url =
      type === "Update"
        ? `http://127.0.0.1:3000/api/v1/articles/${id}`
        : "http://127.0.0.1:3000/api/v1/articles/";

    const method = type === "Update" ? "PATCH" : "POST";
    const res = await axios({
      method,
      url,
      data,
    });
    console.log(res);
    if (res.data.status === "success") {
      showAlert(
        "success",
        `${type.toUpperCase()} Posted Successfully!`
      );
      window.setTimeout(() => {
        location.assign("/");
      }, 1000);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
    console.log(error.response);
  }
};
