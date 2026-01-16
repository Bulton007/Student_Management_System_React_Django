import axios from "axios";

const api = axios.create({
  baseURL: "https://student-management-system-react-django.onrender.com/api/",
});

// ✅ attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ auto refresh when 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // if 401 and not retry yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        // ✅ request new access token
        const res = await axios.post(
          "https://student-management-system-react-django.onrender.com/api/auth/refresh/",
          { refresh: refreshToken }
        );

        localStorage.setItem("access_token", res.data.access);

        // ✅ retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch (err) {
        // refresh token expired too → force logout
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
