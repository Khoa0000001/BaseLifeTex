import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  filterTask,
  getTasksByProject,
  deleteManyTasks,
  getTaskByPagination
} from "../services/taskService";
import { act } from "react";

export const getListTaskByProjectIdRedux = createAsyncThunk(
  "task/list",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await getTasksByProject(projectId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const filterTaskInProject = createAsyncThunk(
  "task/filterTaskInProject",
  async ({ projectId, data }) => {
    const response = await filterTask(projectId, data);
    return response.data;
  }
);
export const deleteManyTasksRedux = createAsyncThunk(
  "task/deleteMany",
  async (ids, { rejectWithValue }) => {
    const result = await deleteManyTasks(ids);

    if (result.success) {
      return ids;
    } else {
      return rejectWithValue(result.error);
    }
  }
);
export const getByIndexParanation = createAsyncThunk(
  "task/getByIndexParanation",
  async ({projectId,page,pageSize}, { rejectWithValue }) => {
    const reponse = await getTaskByPagination(projectId,+page,+pageSize);    
    if (reponse.success) {
      return reponse;
    } else {
      return rejectWithValue(reponse.error);
    }
  }
);
const taskSlice = createSlice({
  name: "task",
  initialState: {
    listTask: [],
    listComment: [],
    isFetching: false,
    total:0,
    limit:5,
    page:1,
    error: null,
  },
  reducers: {
    changePage: (state,action) => {
      state.page = action.payload + 1; // Chuyển từ 0-based sang 1-based
    },
    changeRowPerPage: (state, action) => {
      state.limit = action.payload,
      state.page = 1
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getListTaskByProjectIdRedux.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(getListTaskByProjectIdRedux.fulfilled, (state, action) => {
        state.isFetching = false;
        state.listTask = action.payload;
      })
      .addCase(getListTaskByProjectIdRedux.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })
      .addCase(filterTaskInProject.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(filterTaskInProject.fulfilled, (state, action) => {
        state.isFetching = false;
        state.listTask = action.payload;
      })
      .addCase(filterTaskInProject.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })
      .addCase(deleteManyTasksRedux.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(deleteManyTasksRedux.fulfilled, (state, action) => {
        state.isFetching = false;
        state.listTask = state.listTask.filter(
          (task) => !action.payload.includes(task.id)
        );
      })
      .addCase(deleteManyTasksRedux.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })
      .addCase(getByIndexParanation.pending,(state) => {
        state.isFetching = true;
      })
      .addCase(getByIndexParanation.fulfilled,(state,action) => {
        state.isFetching = false;
        state.listTask = action.payload.data;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total
      })
      .addCase(getByIndexParanation.rejected,(state,action) => {
        state.isFetching = false;
        state.error = action.payload;
      })
  },
});

export const {
  changePage,
  changeRowPerPage
} = taskSlice.actions;

export default taskSlice.reducer;
