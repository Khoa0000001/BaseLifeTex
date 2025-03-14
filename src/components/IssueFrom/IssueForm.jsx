import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import style from "./IssueForm.module.scss";
import Grid from "@mui/material/Grid2";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import UploadDownloadImage from "../UploadDownloadImage/UploadDownloadImage";
import { postIssueData } from "../../apis/Issue";
import { toolTaskStatus } from "../../tools/toolsCvStatus";
import Loading from "../Loading/Loading";
import { getlistUser } from "../../apis/use";

export default function IssueForm({ isOpen, onClose, status }) {
  const params = new URLSearchParams(window.location.search);
  const idProject = params.get("idProject");
  const token = "jhgshddabjsbbdak";

  const [names, setNames] = useState([]);
  const [personName, setPersonName] = useState([]);
  const [issueName, setIssueName] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleReset = () => {
    setPersonName([]);
    setIssueName("");
    setLink("");
    setDescription("");
    setStartDate(null);
    setEndDate(null);
    setImageFile(null);
    setErrors({});
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    const uniqueArr = value.filter(
      (num) => value.indexOf(num) === value.lastIndexOf(num)
    );
    setPersonName(() => uniqueArr);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};

    if (!issueName) newErrors.issueName = "Tên vấn đề is required";
    if (!link) newErrors.link = "Link is required";
    if (!description) newErrors.description = "Mô tả is required";
    if (!startDate) newErrors.startDate = "Ngày bắt đầu is required";
    if (!endDate) newErrors.endDate = "Ngày kết thúc is required";
    if (endDate < startDate) newErrors.endDate = "Ngày kết thúc phải lớn hơn";
    if (personName.length === 0)
      newErrors.personName = "Người nhận việc is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true); // Start loading
        const response = await postIssueData(
          {
            personName,
            issueName,
            link,
            description,
            startDate,
            endDate,
            imageFile,
            status: toolTaskStatus(status),
            projectId: idProject,
          },
          token
        );
        setSnackbar({
          open: true,
          message: "Tạo vấn đề thành công!",
          severity: "success",
        });
        console.log("Data posted successfully:", response.data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setSnackbar({
          open: true,
          message: "Tạo vấn đề thất bại!",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
      handleReset();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getlistUser(token, idProject);
        setNames(response.members);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUsers();
  }, []);

  const styleBox = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    border: "none",
  };

  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleBox}>
          <form onSubmit={handleSubmit}>
            <div className={style.issueForm}>
              <div className={style.header}>
                <h2>Tạo vấn đề</h2>
                <div
                  className={style.close}
                  onClick={() => {
                    onClose();
                    handleReset();
                  }}
                >
                  X
                </div>
              </div>
              {loading ? (
                <Loading />
              ) : (
                <>
                  <div className={style.body}>
                    <Grid container spacing={8}>
                      <Grid size={6}>
                        <div className={style.box}>
                          <span>Tên vấn đề: </span>
                          <TextField
                            id="outlined-basic"
                            label="Tên vấn đề"
                            variant="outlined"
                            fullWidth
                            value={issueName}
                            onChange={(e) => setIssueName(e.target.value)}
                            error={!!errors.issueName}
                            helperText={errors.issueName}
                          />
                        </div>
                      </Grid>
                      <Grid size={6}>
                        <div className={style.box}>
                          <span>Link: </span>
                          <TextField
                            id="outlined-basic"
                            label="Link"
                            variant="outlined"
                            fullWidth
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            error={!!errors.link}
                            helperText={errors.link}
                          />
                        </div>
                      </Grid>
                      <Grid size={6}>
                        <div className={style.box}>
                          <span>Mô tả chi tiết: </span>
                          <TextField
                            id="outlined-multiline-static"
                            label="Mô tả"
                            multiline
                            rows={6}
                            fullWidth
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            error={!!errors.description}
                            helperText={errors.description}
                          />
                        </div>
                      </Grid>
                      <Grid size={6} container spacing={4}>
                        <Grid size={12}>
                          <div className={style.box}>
                            <span>Người nhận việc: </span>
                            <FormControl
                              sx={{ m: 1, width: 1 }}
                              error={!!errors.personName}
                            >
                              <InputLabel id="demo-multiple-name-label">
                                Name
                              </InputLabel>
                              <Select
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                multiple
                                value={personName}
                                onChange={handleChange}
                                input={<OutlinedInput label="Name" />}
                              >
                                {names?.map((person) => (
                                  <MenuItem
                                    key={person?._id}
                                    value={person?._id}
                                  >
                                    <div className={style.wrapItemSlc}>
                                      <img
                                        className={style?.avatar}
                                        src="image/f8ad738c648cb0c7cc815d6ceda805b0.png"
                                        alt=""
                                      />
                                      <div className={style.name}>
                                        {person?.userName}
                                      </div>
                                    </div>
                                  </MenuItem>
                                ))}
                              </Select>
                              {errors.personName && (
                                <p className={style.errorText}>
                                  {errors.personName}
                                </p>
                              )}
                            </FormControl>
                          </div>
                        </Grid>
                        <Grid size={12}>
                          <div className={style.box}>
                            <span>Hình ảnh: </span>
                            <UploadDownloadImage
                              image={imageFile}
                              setImage={setImageFile}
                            />
                          </div>
                        </Grid>
                      </Grid>
                      <Grid size={6}>
                        <div className={style.box}>
                          <span>Ngày bắt đầu: </span>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DatePicker"]}>
                              <div className={style.date}>
                                <DatePicker
                                  label="Ngày bắt đầu"
                                  value={startDate}
                                  onChange={(newValue) =>
                                    setStartDate(newValue)
                                  }
                                  slotProps={{
                                    textField: {
                                      error: !!errors.startDate,
                                      helperText: errors.startDate,
                                    },
                                  }}
                                />
                                {errors.startDate && (
                                  <p className={style.errorText}>
                                    {errors.startDate}
                                  </p>
                                )}
                              </div>
                            </DemoContainer>
                          </LocalizationProvider>
                        </div>
                      </Grid>
                      <Grid size={6}>
                        <div className={style.box}>
                          <span>Ngày kết thúc: </span>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DatePicker"]}>
                              <div className={style.date}>
                                <DatePicker
                                  label="Ngày kết thúc"
                                  value={endDate}
                                  onChange={(newValue) => setEndDate(newValue)}
                                  slotProps={{
                                    textField: {
                                      error: !!errors.endDate,
                                      helperText: errors.endDate,
                                    },
                                  }}
                                />
                                {errors.endDate && (
                                  <p className={style.errorText}>
                                    {errors.endDate}
                                  </p>
                                )}
                              </div>
                            </DemoContainer>
                          </LocalizationProvider>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </>
              )}
              <div className={style.container}>
                <button type="submit" className={style.submit}>
                  Tạo
                </button>
              </div>
            </div>
          </form>
        </Box>
      </Modal>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
