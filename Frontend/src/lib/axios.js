import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ?"http://localhost:5001/api" : "44.211.44.223/api",
    withCredentials: true,
});