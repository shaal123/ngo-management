import api from "./api";

// Get all volunteers, optionally filtered by a search term
export const getVolunteers = async (search = "") => {
  const response = await api.get("/volunteers", { params: { search } });
  return response.data;
};

export const getVolunteerById = async (id) => {
  const response = await api.get(`/volunteers/${id}`);
  return response.data;
};

export const createVolunteer = async (volunteerData) => {
  const response = await api.post("/volunteers", volunteerData);
  return response.data;
};

export const updateVolunteer = async (id, volunteerData) => {
  const response = await api.put(`/volunteers/${id}`, volunteerData);
  return response.data;
};

export const deleteVolunteer = async (id) => {
  const response = await api.delete(`/volunteers/${id}`);
  return response.data;
};
