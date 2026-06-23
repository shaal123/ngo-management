import api from "./api";

// Calls POST /api/auth/login with email & password
export const loginAdmin = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

// Calls GET /api/auth/profile to verify the current token & get admin info
export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};
