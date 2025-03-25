import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

import styles from "./Navbar.module.scss";
import ProjectCard from "../../../components/projectCard/ProjectCard";
import { getLstProject } from "../../../services/projectService";
import Loading from "../../../components/Loading/Loading";
import { useDispatch, useSelector } from "react-redux";
import { getListProjectByUser } from "../../../redux/projectSlice";

export default function Navbar() {
  // const [lstProject, setLstProject] = useState([]);
  const lstProject = useSelector((state) => state.project.listProject);
  const [loading, setLoading] = useState(true); // State for loading
  const navigate = useNavigate(); // Initialize navigate
  const dispatch = useDispatch();

  const fetchProjects = async () => {
    setLoading(true); // Start loading
    try {
      // const response = await getLstProject();
      dispatch(getListProjectByUser());

      if (Array.isArray(lstProject)) {
        // setLstProject(response);

        // Set default idProject to the first project's _id
        if (lstProject.length > 0) {
          const firstProjectId = lstProject[0]._id;
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.set("idProject", firstProjectId);
          navigate(`${currentUrl.pathname}${currentUrl.search}`);
        }
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleProjectClick = (projectId) => {
    // dispatch(setLoading(true)); // Dispatch setLoading action
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("idProject", projectId); // Add or update idProject in URL
    navigate(`${currentUrl.pathname}${currentUrl.search}`); // Navigate to the updated URL
    // dispatch(setLoading(false)); // Dispatch setLoading
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className={styles.navbar}>
      <div className={styles.headerNavbar}>
        <div className={styles.icon}>
          <svg
            width="27"
            height="30"
            viewBox="0 0 27 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_13_251)">
              <path
                d="M23.8359 7.03125V0H3.16406V3.51562H0V26.4844H3.16406V30H23.8359V26.4844H27V7.03125H23.8359ZM3.16406 24.7266H1.58203V8.78906H3.16406V24.7266ZM3.16406 7.03125H1.58203V5.27344H3.16406V7.03125ZM22.2539 28.2422H18.6265L22.2539 24.2117V28.2422ZM17.5078 26.9992V22.9688H21.1353L17.5078 26.9992ZM22.2539 21.2109H15.9258V28.2422H4.74609V1.75781H22.2539V21.2109ZM25.418 24.7266H23.8359V8.78906H25.418V24.7266Z"
                fill="#579AD7"
              />
              <path
                d="M19.0898 10.6055H7.91016V12.3633H19.0898V10.6055Z"
                fill="#579AD7"
              />
              <path
                d="M19.0898 14.1211H7.91016V15.8789H19.0898V14.1211Z"
                fill="#579AD7"
              />
              <path
                d="M19.0898 7.08984H7.91016V8.84766H19.0898V7.08984Z"
                fill="#579AD7"
              />
            </g>
            <defs>
              <clipPath id="clip0_13_251">
                <rect width="27" height="30" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className={styles.projectListTitle}>Danh sách dự án tham gia</div>
      </div>
      <div className={styles.bodyNavbar}>
        {loading ? (
          <Loading />
        ) : (
          lstProject.map((project, index) => (
            <div
              key={index}
              onClick={() => handleProjectClick(project._id)} // Add onClick handler
              style={{ cursor: "pointer" }}
            >
              <ProjectCard project={project} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
