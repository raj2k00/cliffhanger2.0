/*eslint-disable*/
import axios from "axios";
import { showAlert } from "./alert";

export const sendPost = async (data) => {
  try {
    const res = await axios({
      method: "POST",
      url: `http://127.0.0.1:3000/userArticle`,
      data,
    });
    if (res.data.status === "success") {
      showAlert("success", "Posted in successfully");
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};
