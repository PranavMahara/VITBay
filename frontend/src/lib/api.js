import axios from "axios";

const api = axios.create({ baseURL: "/api/v1", withCredentials: true, timeout: 30000 });

export const errorMessage = (err, fallback = "Something went wrong. Please try again.") =>
  err?.response?.data?.message || (err?.code === "ECONNABORTED" ? "The request timed out. Check your connection." : fallback);

export default api;
