import api from "./api";

export const getSupervisors = async () => {
  const response = await api.get("/supervisors");
  return response.data;
};

export const createSupervisor = async (data) => {
  const response = await api.post("/supervisors", data);
  return response.data;
};

export const updateSupervisor = async (id, data) => {
  const response = await api.put(`/supervisors/${id}`, data);
  return response.data;
};

export const deleteSupervisor = async (id) => {
  const response = await api.delete(`/supervisors/${id}`);
  return response.data;
};
