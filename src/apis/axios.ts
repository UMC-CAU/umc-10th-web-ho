import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const storedToken = window.localStorage.getItem("ACCESS_TOKEN");
    let token: string | null = null;

    if (storedToken) {
        try {
            token = JSON.parse(storedToken) as string;
        } catch {
            token = storedToken;
        }
    }

    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default axiosInstance;
