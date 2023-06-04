import axios from "axios";
import { showAlert } from "./alert";

export const deletePost = async (id) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `/api/v1/articles/${id}`,
    });
    if (res.status === 204) {
      showAlert("success", "Article Deleted Successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};
