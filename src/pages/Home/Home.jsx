// src/pages/Home/Home.jsx
import { useEffect, useState } from "react";
import "./Home.scss";
import { useSearchParams } from "react-router-dom";
import { Popover } from "@mui/material";
import MemberListContent from "../../components/memberList/MemberList";
import KanbanBoard from "../../components/Kanban/KanbanBoard";
import ListHome from "../../components/List/ListHome";
import { getProjectId } from "../../services/projectService";
import FilterDialog from "../../components/FilterForm/FilterDialog";
import { searchTasks } from "../../services/taskService";
import { getTasksByProject } from "../../services/taskService";

export default function Home() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchParams] = useSearchParams();
  const idProject = searchParams.get("idProject") || "";
  const [viewMode, setViewMode] = useState("kanban");
  const [nameProject, setNameProject] = useState("Phần mềm đánh giá"); // Giá trị mặc định
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [result, setResult] = useState([]);

  async function fetchProjectData(idPrj) {
    try {
      const response = await getProjectId(idPrj);
      if (response.success) {
        setNameProject(response.data.name);
      }
    } catch (error) {
      setNameProject("Phần mềm đánh giá");
      throw error;
    }
  }

  useEffect(() => {
    if (idProject) {
      fetchProjectData(idProject);
    }
  }, [idProject]);

  async function getTasks(idPrj) {
    const response = await getTasksByProject(idPrj);
    return response;
  }

  async function searchByKeyword(keyword, idProject) {
    if (!keyword) {
      const response = await getTasks(idProject);
      setResult(response.data);
        return response;
    } else {
      try {
        const response = await searchTasks(keyword);
        setResult(response.data);
        return response;
      } catch (error) {
        console.error("Search error:", error);
        return null;
      }
    }
  }

  useEffect(() => {
    setResult([]);
    if (!idProject) return;

    // Đợi 300ms mới cập nhật keyword mới, tránh cho server quá tải request, gây lỗi 500
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 200);

    return () => clearTimeout(handler); // Hủy timeout nếu keyword thay đổi
  }, [keyword, idProject]);

  useEffect(() => {
    searchByKeyword(debouncedKeyword, idProject);
  }, [debouncedKeyword, idProject]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSwitchToKanban = () => {
    setViewMode("kanban");
  };

  const handleSwitchToList = () => {
    setViewMode("list");
  };

  const handleClickFilter = (event) => {
    setAnchorElFilter(event.currentTarget); // Mở Popover Filter
  };

  const handleCloseFilter = () => {
    setAnchorElFilter(null); // Đóng Popover Filter
  };

  const openFilter = Boolean(anchorElFilter);
  const filterId = openFilter ? "filter-popover" : undefined;
  return (
    <div className="home-container">
      {/* Header Section */}
      <div className="header-section">
        <div className="header-container">
          <div className="project-info">
            <p className="project-path">Dự án / {nameProject}</p>
          </div>
          <div className="view-toggle">
            <img
              src="image/Column.png"
              alt="Kanban View"
              className={`view-icon ${viewMode === "kanban" ? "active" : ""}`}
              onClick={handleSwitchToKanban}
            />
            <img
              src="image/List.png"
              alt="List View"
              className={`view-icon ${viewMode === "list" ? "active" : ""}`}
              onClick={handleSwitchToList}
            />
          </div>
        </div>
      </div>

      {/* Toolbar Section */}
      <div className="toolbar-section">
        <div className="search-container">
          <svg
            className="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m2.6-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="search-input"
            onChange={(e) => setKeyword(e.target.value.trim())}
          />
          <div className="avatar-group">
            {[
              "image/image_4.png",
              "image/image_5.png",
              "image/image_6.png",
              "image/image_7.png",
              "image/image_8.png",
              "image/dot.png",
            ].map((avatar, index) => (
              <img
                onClick={handleClick}
                key={index}
                src={avatar}
                alt={`Avatar ${index + 1}`}
                className="avatar"
              />
            ))}
          </div>
        </div>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          sx={{ mt: 1 }}
        >
          <MemberListContent onClose={handleClose} />
        </Popover>

        <div className="task-header">
          <div className="task-icons">
            <img src="image/Trash.png" alt="Delete" className="tool-icon" />
            <img
              src="image/Filter.png"
              alt="Filter"
              className="tool-icon"
              onClick={handleClickFilter}
              aria-describedby={filterId}
            />
            <Popover
              id={filterId}
              open={openFilter}
              anchorEl={anchorElFilter}
              onClose={handleCloseFilter}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <FilterDialog idProject={idProject} />
            </Popover>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="content-section">
        { viewMode === "kanban"
          ? <KanbanBoard
            result={result}
          />
          : <ListHome
            result={result}
          />
        }
      </div>
    </div>
  );
}
