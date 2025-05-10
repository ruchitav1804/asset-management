import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ✅ Attach token to every request if it exists
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle errors (e.g., unauthorized)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response && response.status === 401) {
      // Remove token since it's unauthorized
      localStorage.removeItem("ACCESS_TOKEN");

      // Optional: redirect to login
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
