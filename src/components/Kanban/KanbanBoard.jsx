import { closestCorners, DndContext } from "@dnd-kit/core";
import React, { useEffect, useState } from "react";
import KanbanColumn from "./KanbanColumn";
import { getTasksByProject, updateTaskStatus } from "../../services/taskService";
import { useSearchParams } from "react-router-dom";
import "./KanbaBoard.scss";
import { getListTaskByProjectIdRedux } from "../../redux/taskSlice";
import { useDispatch, useSelector} from "react-redux"; // Thêm import useDispatch

function transformTasksData(tasks) {
  return tasks.reduce((acc, task) => {
    const statusMap = {
      pending: "pending",
      inProgress: "inProgress",
      completed: "completed",
      done: "done",
    };

    const columnKey = statusMap[task.status] || "pending";

    if (!acc[columnKey]) {
      acc[columnKey] = {
        title: getStatusTitle(columnKey),
        tasks: [],
      };
    }

    acc[columnKey].tasks.push({
      ...task,
      id: task._id,
      userName: task.assigneeId.length > 0 ? task.assigneeId[0].userName : "Chưa giao",
      assigneeUserNames: task.assigneeId.map((assignee) => assignee.userName),
      assigneeId: task.assigneeId.map((assignee) => ({
        ...assignee,
        id: assignee._id,
      })),
    });

    return acc;
  }, {
    pending: { title: "Công việc mới", tasks: [] },
    inProgress: { title: "Đang thực hiện", tasks: [] },
    completed: { title: "Hoàn thành", tasks: [] },
    done: { title: "Kết thúc", tasks: [] },
  });
}

function getStatusTitle(status) {
  const titles = {
    pending: "Công việc cần làm",
    inProgress: "Công việc đang làm",
    completed: "Công việc đã hoàn thành",
    done: "Công việc đã xong",
  };
  return titles[status] || "Công việc khác";
}

function KanbanBoard() {
  const dispatch = useDispatch();
  const listTask = useSelector((state) => state.task.listTask);
  const [columns, setColumns] = useState({});
  const [searchParams] = useSearchParams();
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const idProject = searchParams.get("idProject");

  const fetchData = async () => {
    try {
      // const data = await getTasksByProject(idProject);
      // dispatch(getListTaskByProjectIdRedux(idProject))
      // const formattedData = transformTasksData(data.data || data);
      // setColumns(formattedData);
      dispatch(getListTaskByProjectIdRedux(idProject))

    } catch (error) {
      console.error("Lấy danh sách công việc thất bại:", error);
    }
  };

  useEffect(() => {
    if (listTask && listTask.length > 0) {
      const formattedData = transformTasksData(listTask);
      setColumns(formattedData);
    }
  },[listTask])

  useEffect(() => {
    if (idProject) {
      fetchData();
    }
  }, [idProject,dispatch]);

  const onDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const sourceColumnKey = Object.keys(columns).find((key) =>
      columns[key].tasks.find((task) => task.id === active.id)
    );

    if (!sourceColumnKey) return;

    const destinationColumnKey = over.id;

    if (sourceColumnKey === destinationColumnKey) return;

    const taskToMove = columns[sourceColumnKey].tasks.find(
      (task) => task.id === active.id
    );

    if (!taskToMove) return;

    taskToMove.status = destinationColumnKey;

    setColumns((prev) => {
      const newColumns = { ...prev };
      newColumns[sourceColumnKey].tasks = newColumns[sourceColumnKey].tasks.filter(
        (task) => task.id !== active.id
      );
      newColumns[destinationColumnKey].tasks = [
        ...newColumns[destinationColumnKey].tasks,
        taskToMove,
      ];
      return newColumns;
    });

    setTaskToUpdate(taskToMove);
  };

  useEffect(() => {
    if (taskToUpdate) {
      updateTaskStatus(taskToUpdate.id, taskToUpdate.status)
        .then(() => {
          console.log("Cập nhật thành công");
          fetchData();
        })
        .catch((error) => console.error("Lỗi cập nhật:", error))
        .finally(() => setTaskToUpdate(null));
    }
  }, [taskToUpdate]);

  return (
    <div className="kanban-wrapper">
      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={onDragEnd}
      >
        <div className="kanban-container">
          {Object.entries(columns).map(([key, column]) => (
            <KanbanColumn key={key} columnId={key} column={column} />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

export default KanbanBoard;