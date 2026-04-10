import axios from "axios";
import { useLocalStorage } from "../hooks/useLocalStorage";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const { getItem } = useLocalStorage<string>("ACCESS_TOKEN");
    const token = getItem();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default axiosInstance;
