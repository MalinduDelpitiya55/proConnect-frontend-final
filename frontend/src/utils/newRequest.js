import axios from "axios";

const newRequest = axios.create({
  baseURL: "https://fiverr-clone-backend-git-main-malindudelpitiya55s-projects.vercel.app/api/",
  withCredentials: true,
});

export default newRequest;
