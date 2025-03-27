import React, { useEffect, useState } from "react";
import { Modal, Box, TextField, Button, Backdrop } from "@mui/material";
import {
  getListCommentByTask,
  addCommentTask,
} from "../../services/commentService";
import "./CommentModal.scss";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

const CommentModal = ({ open, handleClose, task }) => {
  const user = useSelector((state) => state.auth.login.currentUser);
  const getListComment = async (id) => {
    if (user) {
      let response = await getListCommentByTask(id);
      if (response && response.success === true) {
        setComments(response.data);
      } else {
        toast.error(response.message);
      }
    }
  };
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const handleAddComment = async () => {
    if (user && user.data) {
      if (comment) {
        let res = await addCommentTask({
          taskId: task._id,
          content: comment,
        });
        if (res && res.success === true) {
          toast.success(res.message);
          setComment("");
        } else {
          toast.error(res.message);
          setComment("");
        }
      } else {
        toast.error("Comment không được để trống");
      }
    } else {
      toast.warning("Đăng nhập để thực hiện yêu cầu này!");
    }
    getListComment(task._id);
  };
  useEffect(() => {
    if (task) {
      getListComment(task._id);
    }
  }, [task]);

  return (
    <>
      <Modal
        open={open}
        style={{ border: "none", outline: "none" }}
        onClose={handleClose}
        className="modal-container"
      >
        <Box className="comment-modal">
          <div className="kaban-detail-header">
            <p>
              <EventAvailableIcon /> Việc 1
            </p>
            <button className="close-btn" onClick={handleClose}>
              ✖
            </button>
          </div>
          <div className="content">
            <div className="kaban-content">
              <div className="kaban-content-text">
                <p className="name-task">{task?.title}</p>
                <p className="desc-task">{task?.description}</p>
              </div>
              <div className="comment-section">
                <h4>Bình luận</h4>
                <div className="comment-box">
                  <img
                    src="https://w7.pngwing.com/pngs/922/214/png-transparent-computer-icons-avatar-businessperson-interior-design-services-corporae-building-company-heroes-thumbnail.png"
                    alt="user"
                    className="avatar"
                  />
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    multiline
                    minRows={3}
                    placeholder="Nhập bình luận..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="comment-input"
                  />
                </div>
                <div className="comment-actions">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddComment}
                  >
                    Gửi
                  </Button>
                  <Button variant="contained" className="cancel-btn">
                    Hủy
                  </Button>
                </div>
                <div
                  className={user ? "comment-list fix-height" : "comment-list"}
                >
                  {comments &&
                    comments.length > 0 &&
                    comments.map((cmt) => (
                      <div key={cmt._id} className="comment">
                        <img
                          src={
                            cmt.userId.avatar ||
                            "https://w7.pngwing.com/pngs/922/214/png-transparent-computer-icons-avatar-businessperson-interior-design-services-corporae-building-company-heroes-thumbnail.png"
                          }
                          alt="user"
                          className="avatar"
                        />
                        <div className="cmt-text">
                          <p>{cmt.userId.userName}</p>
                          <p>{cmt.content}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="kaban-info">
              <div className="kaban-description image">
                <p>Hình ảnh:</p>
                <img
                  // src="https://res.cloudinary.com/dvmpaqgtv/image/upload/v1742269884/Screenshot_2023-11-01_112242_c7zh0g.png"
                  src={task.image}
                  alt=""
                />
              </div>
            </div>
          </div>
        </Box>
      </Modal>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default CommentModal;
