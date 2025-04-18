// src/components/ListHome/ListHome.jsx
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { updateIssueDataStatus } from "../../apis/Issue";
import { getByIndexParanation, changePage } from "../../redux/taskSlice";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Input, Avatar, Button, Popover } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import LinkIcon from "@mui/icons-material/Link";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditNoteIcon from "@mui/icons-material/EditNote";
import KabanDetail from "../../components/kabanDetail/KabanDetail";
import CommentModal from "../../components/commentModal/CommentModal";
import MemberListContent from "../../components/memberList/MemberList";
import MemberListContentAdd from "../../components/memberListAdd/MemberListAdd";
import "./ListHome.scss";
import TablePagination from "@mui/material/TablePagination";
import Loading from "../../components/Loading/Loading";
import addProblem from "../../../public/image/addProberm.png";
import IssueForm from "../../components/IssueForm/IssueForm";
import { debounce } from "lodash";
import EditFormv2 from "../editFormv2/editFormv2";

export default function ListHome({
  selectedTasks = [],
  setSelectedTasks,
  searchTerm,
}) {
  const [searchParams] = useSearchParams();
  const idProject = searchParams.get("idProject");
  const listTask = useSelector((state) => state.task.listTask);
  const dispatch = useDispatch();
  let Page = useSelector((state) => state.task.page);
  let Limit = useSelector((state) => state.task.limit);
  let Total = useSelector((state) => state.task.total);

  const [loading, setLoading] = useState(false);

  const debouncedGetList = debounce(async () => {
    setLoading(true);
    try {
      if (idProject) {
        await dispatch(
          getByIndexParanation({
            projectId: idProject,
            page: Page,
            pageSize: Limit,
          })
        );
      }
    } catch (error) {
      toast.error("Tạo nhiệm vụ thất bại", error);
      throw error;
    } finally {
      setLoading(false);
    }
  });

  const getList = () => {
    debouncedGetList();
  };

  useEffect(() => {
    getList();
  }, [idProject, Page, Limit]);

  const [anchorElMemberTask, setAnchorElMemberTask] = useState(null);
  const [anchorElMemberAdd, setAnchorElMemberAdd] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [idOpenDetail, setIdOpenDetail] = useState(null);
  const [openComment, setOpenComment] = useState(false);
  const [idOpenComment, setIdOpenComment] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [idEditModal, setIdEditModal] = useState(null);
  const [open, setOpen] = useState(false);

  const handleChangePage = (event, newPage) => {
    dispatch(changePage(newPage));
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await updateIssueDataStatus(taskId, {
        status: newStatus,
      });
      if (response.success) {
        getList();
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      toast.error("Cập nhật trạng thái thất bại");
      throw new Error(e);
    }
  };

  const onOpenDetail = (taskId) => {
    setIdOpenDetail(taskId);
    setOpenDetail(true);
  };

  const closeDetail = () => {
    setIdOpenDetail(null);
    setOpenDetail(false);
  };

  const onOpenComment = (taskId) => {
    setIdOpenComment(taskId);
    setOpenComment(true);
  };

  const closeComment = () => {
    setIdOpenComment(null);
    setOpenComment(false);
  };

  const handleClickMemberTask = (event, taskId) => {
    event.stopPropagation();
    setSelectedTaskId(taskId);
    setAnchorElMemberTask(event.currentTarget);
  };

  const handleCloseMemberTask = () => {
    setAnchorElMemberTask(null);
    setSelectedTaskId(null);
  };

  const handleClickMemberAdd = (event, taskId) => {
    event.stopPropagation();
    setSelectedTaskId(taskId);
    setAnchorElMemberAdd(event.currentTarget);
  };

  const handleCloseMemberAdd = () => {
    setAnchorElMemberAdd(null);
    setAnchorElMemberTask(null); // Đặt lại anchorElMemberTask
    setSelectedTaskId(null);
  };

  const editModalOpen = (taskId) => {
    setEditModal(true);
    setIdEditModal(taskId);
  };

  const editModalClose = async () => {
    setEditModal(false);
    setIdEditModal(null);
    getList();
  };

  const handleSelectTask = (taskId) => {
    const updatedSelection = selectedTasks.includes(taskId)
      ? selectedTasks.filter((id) => id !== taskId)
      : [...selectedTasks, taskId];
    setSelectedTasks(updatedSelection);
  };
  // Lọc danh sách công việc theo searchTerm
  const filteredTasks = listTask.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="list-home-wrapper">
      <div className="add-job" onClick={() => setOpen(true)}>
        <img src={addProblem} alt="add" />
        <p>Thêm công việc</p>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <Paper
          className="table-paper"
          sx={{ width: "100%", overflow: "hidden" }}
        >
          <TableContainer className="table-container">
            <Table className="task-table" aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell className="table-header-cell"></TableCell>
                  <TableCell className="table-header-cell" align="center">
                    STT
                  </TableCell>
                  <TableCell
                    className="table-header-cell"
                    align="center"
                    style={{ minWidth: "100px" }}
                  >
                    Chi tiết
                  </TableCell>
                  <TableCell
                    className="table-header-cell"
                    align="left"
                    style={{ minWidth: "200px" }}
                  >
                    Tên công việc
                  </TableCell>
                  <TableCell
                    className="table-header-cell"
                    align="left"
                    style={{ minWidth: "200px" }}
                  >
                    Người nhận việc
                  </TableCell>
                  <TableCell
                    className="table-header-cell"
                    align="center"
                    style={{ minWidth: "150px" }}
                  >
                    Bình luận
                  </TableCell>
                  <TableCell
                    className="table-header-cell"
                    align="center"
                    style={{ minWidth: "150px" }}
                  >
                    Ngày bắt đầu
                  </TableCell>
                  <TableCell
                    className="table-header-cell"
                    align="center"
                    style={{ minWidth: "150px" }}
                  >
                    Ngày kết thúc
                  </TableCell>
                  <TableCell
                    className="table-header-cell"
                    align="center"
                    style={{ minWidth: "150px" }}
                  >
                    Trạng thái
                  </TableCell>
                  <TableCell
                    className="table-header-cell"
                    align="left"
                    style={{ minWidth: "200px" }}
                  >
                    Link
                  </TableCell>
                  <TableCell className="table-header-cell" align="left">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      align="center"
                      style={{ textAlign: "center" }}
                    >
                      <h6
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          margin: 0,
                        }}
                      >
                        Không có dữ liệu
                      </h6>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task, index) => (
                    <TableRow
                      key={task._id}
                      className="table-row"
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell className="table-cell">
                        <input
                          type="checkbox"
                          className="checkbox-input"
                          checked={selectedTasks.includes(task._id)}
                          onChange={() => handleSelectTask(task._id)}
                        />
                      </TableCell>
                      <TableCell className="table-cell" align="center">
                        {index + 1}
                      </TableCell>
                      <TableCell className="table-cell" align="center">
                        <InfoOutlinedIcon
                          className="action-icon"
                          onClick={() => onOpenDetail(task._id)}
                        />
                        {idOpenDetail === task._id && (
                          <KabanDetail
                            open={openDetail}
                            handleClose={closeDetail}
                            task={task}
                          />
                        )}
                      </TableCell>
                      <TableCell className="table-cell">
                        <div className="task-name">
                          <img
                            src="image/Pen.png"
                            alt="edit"
                            className="edit-icon"
                          />
                          <p className="text-truncate" title={task.title}>
                            {task.title}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell
                        className="table-cell assignees"
                        align="center"
                      >
                        <div className="task-icons1">
                          <div className="avatar-icon">
                            {task.assigneeId?.slice(0, 2).map((avatar, i) => (
                              <Avatar
                                title={avatar.userName}
                                src={avatar.avatar}
                                key={i}
                                className="avatar"
                                style={{
                                  cursor: "pointer",
                                }}
                              />
                            ))}
                            {task.assigneeId?.length > 2 && (
                              <>
                                <img
                                  src="image/dot.png"
                                  className="more-icon"
                                  onClick={(e) =>
                                    handleClickMemberTask(e, task._id)
                                  }
                                />
                                {selectedTaskId === task._id && (
                                  <Popover
                                    open={Boolean(anchorElMemberTask)}
                                    anchorEl={anchorElMemberTask}
                                    onClose={handleCloseMemberTask}
                                    anchorOrigin={{
                                      vertical: "bottom",
                                      horizontal: "left",
                                    }}
                                    transformOrigin={{
                                      vertical: "top",
                                      horizontal: "left",
                                    }}
                                    sx={{ mt: 1 }}
                                  >
                                    <div className="all-member-in-task">
                                      <MemberListContent
                                        members={task.assigneeId}
                                        onClose={handleCloseMemberTask}
                                      />
                                    </div>
                                  </Popover>
                                )}
                              </>
                            )}
                          </div>
                          <button
                            className="add-user"
                            onClick={(e) => handleClickMemberAdd(e, task._id)}
                          >
                            +
                          </button>
                        </div>
                        {selectedTaskId === task._id && (
                          <Popover
                            open={Boolean(anchorElMemberAdd)}
                            anchorEl={anchorElMemberAdd}
                            onClose={handleCloseMemberAdd}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "left",
                            }}
                            sx={{ mt: 1 }}
                          >
                            <MemberListContentAdd
                              onClose={handleCloseMemberAdd}
                              idProject={idProject}
                              task={task}
                              fetchApi={() => getList()}
                              toast={toast}
                            />
                          </Popover>
                        )}
                      </TableCell>
                      <TableCell
                        className="table-cell comment-cell"
                        align="center"
                        style={{ minWidth: "100px" }}
                      >
                        <img
                          src="image/Chat_.png"
                          alt="comments"
                          className="comment-icon"
                          onClick={() => onOpenComment(task._id)}
                        />
                        {idOpenComment === task._id && (
                          <CommentModal
                            open={openComment}
                            handleClose={closeComment}
                            task={task}
                          />
                        )}
                      </TableCell>
                      <TableCell
                        className="table-cell comment-cell"
                        align="center"
                      >
                        <div className="date-cell">
                          <div className="date000">
                            {dayjs(task.startDate).format("DD/MM/YYYY")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell
                        className="table-cell comment-cell"
                        align="center"
                      >
                        <div className="date-cell">
                          <div className="date000">
                            {dayjs(task.endDate).format("DD/MM/YYYY")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="table-cell status-cell">
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(task._id, e.target.value)
                          }
                          className="status-select"
                        >
                          <option value={0}>Công việc mới</option>
                          <option value={1}>Đang thực hiện</option>
                          <option value={2}>Hoàn thành</option>
                          <option value={3}>Khóa công việc</option>
                        </select>
                      </TableCell>
                      <TableCell className="table-cell">
                        <div className="date-cell">
                          <a
                            href={task.link}
                            target="_blank"
                            className="link-text text-truncate"
                          >
                            {task.link}
                          </a>
                          <LinkIcon className="action-icon" />
                        </div>
                      </TableCell>
                      <TableCell className="table-cell">
                        <Button
                          className="edit-button"
                          onClick={() => editModalOpen(task._id)}
                        >
                          <EditNoteIcon className="action-icon" />
                        </Button>
                        {idEditModal === task._id && (
                          <EditFormv2
                            isOpen={editModal}
                            onClose={editModalClose}
                            task={task}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={Total}
            page={Page - 1}
            onPageChange={handleChangePage}
            rowsPerPage={Limit}
            // onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
      {open && <IssueForm isOpen={open} onClose={() => setOpen(false)} />}
      <ToastContainer />
    </div>
  );
}

const styles = `
  .status-select {
    padding: 4px 8px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    background: #fff;
    font-size: 14px;
    cursor: pointer;
    outline: none;
  }
  .status-select:hover {
    border-color: #9ca3af;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
