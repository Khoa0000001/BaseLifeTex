import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useDispatch } from "react-redux";
import "./FilterDialog.scss";
import { filterTaskInProject } from "../../redux/taskSlice";

const users = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Trần Thị B" },
];

export default function FilterDialog({ idProject }) {
  const [filters, setFilters] = useState({
    assigneeId: "",
    assignerId: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };
  const dispatch = useDispatch();

  const onfilterTask = () => {
    // console.log(filters);
    dispatch(filterTaskInProject({ projectId: idProject, data: filters }));
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} mt={1} padding={2}>
      <h2 className="title-filter">Lọc Công Việc</h2>
      {/* Người được giao */}
      <TextField
        select
        label="Người được giao"
        value={filters.assigneeId}
        onChange={(e) => handleChange("assignerId", e.target.value)}
        fullWidth
      >
        {users.map((user) => (
          <MenuItem key={user.id} value={user.name}>
            {user.name}
          </MenuItem>
        ))}
      </TextField>

      {/* Người báo cáo */}
      <TextField
        select
        label="Người báo cáo"
        value={filters.assignerId}
        onChange={(e) => handleChange("assignerId", e.target.value)}
        fullWidth
      >
        {users.map((user) => (
          <MenuItem key={user.id} value={user.name}>
            {user.name}
          </MenuItem>
        ))}
      </TextField>

      {/* Ngày giao việc */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <DatePicker
            label="Ngày giao việc"
            // value={filters.startDate}
            onChange={(newValue) => handleChange("startDate", newValue)}
            format="DD/MM/YYYY"
          />
        </DemoContainer>
      </LocalizationProvider>

      {/* Ngày kết thúc */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <DatePicker
            label="Ngày kết thúc"
            // value={filters.endDate}
            onChange={(newValue) => handleChange("endDate", newValue)}
            format="DD/MM/YYYY"
          />
        </DemoContainer>
      </LocalizationProvider>

      {/* Button Lọc */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={onfilterTask}
      >
        Lọc
      </Button>
    </Box>
  );
}
