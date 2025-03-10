import { useState } from "react";
import "./ProjectCard.scss";
import { Popper } from "@mui/base/Popper";

const ProjectCard = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  return (
    <div className="project-card">
      <div className="project-header">
        <div className="right">
          <h1 className="name-project">Dự án Internal</h1>
          <p className="project-id">
            <strong>Mã dự án:</strong> 1234
          </p>
        </div>
        <div className="project-dates">
          <p>
            <strong>Ngày bắt đầu:</strong> 04/03/2025
          </p>
          <p>
            <strong>Ngày kết thúc:</strong> 05/07/2025
          </p>
        </div>
      </div>
      <div className="project-responsible">
        <div>
          <p>
            <strong>Người phụ trách</strong>
          </p>
          <div className="responsible-info">
            <span>Nguyễn Đình Minh</span>
          </div>
        </div>
        <img
          className="avatar"
          src="src/assets/image/f8ad738c648cb0c7cc815d6ceda805b0.png"
          alt=""
        />
      </div>
      <div className="project-footer">
        <img
          onClick={handleClick}
          src="src\assets\image\e10ebdc6f22af020d1cdd58a063bf347.png"
          alt=""
        />

        <button className="status-btn">Chưa hoàn thành</button>
      </div>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <div>The content of the Popper.</div>
      </Popper>
    </div>
  );
};

export default ProjectCard;
