import axios from "axios";

const api = axios.create({
  baseURL: "https://kpi-management-serviice.onrender.com",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    if (url?.includes("/auth/login/")) {
      return Promise.reject(error);
    }

    if (status === 401) {
      localStorage.removeItem("access");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      localStorage.removeItem("first_name");
      localStorage.removeItem("last_name");
      window.dispatchEvent(new Event("auth:logout"));
    }

    if (error.request && !error.response) {
      if (window.location.pathname !== "/server-down") {
        window.location.href = "/server-down";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
