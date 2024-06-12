import axios from "axios";

const newRequest = axios.create({
  baseURL: "https://fiverr-clone-backend.vercel.app/api/",
  withCredentials: true,
});

export default newRequest;
