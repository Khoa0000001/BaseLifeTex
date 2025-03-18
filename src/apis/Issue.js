import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const postIssueData = async (data, token) => {
  try {
    const response = await axios.post(
      `${backendUrl}/tasks/create-task`,
      {
        assigneeId: data.personName,
        title: data.issueName,
        link: data.link,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        images: data.imageFile,
        status: data.status,
        projectId: data.projectId,
        assignerId: "65f0b8d0fbd3a6e9f8e2c9d4",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateIssueData = async (id, data) => {
  try {
    const response = await axios.put(
      `${backendUrl}/tasks/edit-task/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
  }
};

export const getLisTaskById = async (id) => {
  try {
    const response = await axios.get(`${backendUrl}/tasks/project/${id}`);
    // console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateIssueDataStatus = async (id, data) => {
  try {
    const response = await axios.put(`${backendUrl}/tasks/${id}/status`, data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
  }
};

export const addMemberTask = async (id, data) => {
  try {
    const response = await axios.post(
      `${backendUrl}/tasks/${id}/add-user`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
  }
};

export const updateIssueDataImage = async (id, data, imageFile) => {
  console.log(data);

  try {
    const formData = new FormData();

    // Append từng field vào formData
    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key])) {
        data[key].forEach((item) => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, data[key]);
      }
    });

    // Nếu có file, append vào formData
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await axios.put(
      `${backendUrl}/tasks/edit-task/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating issue:", error);
  }
};
