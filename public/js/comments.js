/*eslint-disable*/
import axios from "axios";
import { showAlert } from "./alert";

export const postComment = async (comment, id) => {
  try {
    const res = await axios({
      method: "POST",
      url: `/api/v1/articles/${id}/comments`,
      data: {
        comment,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "posted successfully");
      window.setTimeout(() => {
        window.location = document.referrer;
      }, 1500);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};

export const deleteComment = async (id) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `/api/v1/comments/${id}`,
    });
    if (res.status === 204) {
      showAlert("success", "Deleted successfully");
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};
