import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8366",
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers['token'] = token
  }
  // Verifica si los datos son de tipo FormData
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  } else {
    // Por defecto, establece 'Content-Type' como 'application/json'
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosClient;