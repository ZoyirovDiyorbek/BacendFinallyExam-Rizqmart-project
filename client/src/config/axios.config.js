import axios from "axios";
const customAxios = axios.create({
  baseURL: process.env.SERVER_BASE_URL,
  withCredentials: true,
  timeout: 20000,
});

export default customAxios;
