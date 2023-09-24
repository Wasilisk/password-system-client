import axios, { InternalAxiosRequestConfig } from "axios";

const $api = axios.create({
  baseURL: "http://localhost:3001/",
});

$api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers.set(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  return config;
});

$api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error.response.data?.message);
  }
);
export default $api;
