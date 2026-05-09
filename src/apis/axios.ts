import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

type RetryAxiosRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

type RefreshResponse = {
    data?: {
        accessToken?: string;
        refreshToken?: string;
    };
};

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// Attach access token on every request (if present)
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

// Refresh queue to avoid multiple concurrent refresh calls
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (error: unknown) => void;
    config: RetryAxiosRequestConfig;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            if (token) {
                prom.config.headers = prom.config.headers ?? {};
                prom.config.headers.Authorization = `Bearer ${token}`;
            }
            prom.resolve(axiosInstance(prom.config));
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryAxiosRequestConfig | undefined;

        // If no response or not a 401, just reject
        if (!error.response || error.response.status !== 401) {
            return Promise.reject(error);
        }

        // Avoid infinite loop: if request already retried, reject
        if (originalRequest && originalRequest._retry) {
            console.log('[Axios] Request already retried, rejecting...');
            return Promise.reject(error);
        }

        // If refresh endpoint itself returns 401 or fails, clear tokens and redirect to login
        const baseUrl = (import.meta.env.VITE_SERVER_API_URL || "").replace(/\/$/, "");
        const refreshEndpoint = `${baseUrl}/auth/refresh`;

        // If the failed request is the refresh endpoint, force logout
        if (originalRequest && originalRequest.url && originalRequest.url.includes('/auth/refresh')) {
            console.log('[Axios] Refresh endpoint itself failed, logging out...');
            try {
                window.localStorage.removeItem("ACCESS_TOKEN");
                window.localStorage.removeItem("REFRESH_TOKEN");
            } catch {
                // Ignore storage errors during forced logout.
            }
            window.location.href = '/login';
            return Promise.reject(error);
        }

        const storedRefresh = window.localStorage.getItem("REFRESH_TOKEN");
        let refreshToken: string | null = null;
        if (storedRefresh) {
            try {
                refreshToken = JSON.parse(storedRefresh) as string;
            } catch {
                refreshToken = storedRefresh;
            }
        }

        if (!refreshToken) {
            // No refresh token available -> logout
            console.log('[Axios] No refresh token found, logging out...');
            try {
                window.localStorage.removeItem("ACCESS_TOKEN");
                window.localStorage.removeItem("REFRESH_TOKEN");
            } catch {
                // Ignore storage errors during forced logout.
            }
            window.location.href = '/login';
            return Promise.reject(error);
        }

        // Queue up requests while a refresh is in progress
        if (isRefreshing) {
            console.log('[Axios] Refresh in progress, queueing request...');
            return new Promise((resolve, reject) => {
                if (originalRequest) {
                    failedQueue.push({ resolve, reject, config: originalRequest });
                } else {
                    reject(error);
                }
            });
        }

        isRefreshing = true;
        console.log('[Axios] Starting refresh token request...');

        try {
            // Call refresh endpoint directly with axios (not axiosInstance) to avoid interceptors
            const refreshResponse = await axios.post<RefreshResponse>(refreshEndpoint, { refresh: refreshToken });
            console.log('[Axios] Refresh response received:', refreshResponse?.status);

            const newAccess = refreshResponse?.data?.data?.accessToken;
            const newRefresh = refreshResponse?.data?.data?.refreshToken;

            console.log('[Axios] New access token:', newAccess ? 'received' : 'missing');
            console.log('[Axios] New refresh token:', newRefresh ? 'received' : 'missing');

            if (newAccess) {
                try {
                    window.localStorage.setItem("ACCESS_TOKEN", JSON.stringify(newAccess));
                    console.log('[Axios] ACCESS_TOKEN saved');
                } catch (e) {
                    console.error('[Axios] Failed to save ACCESS_TOKEN:', e);
                }
            }
            if (newRefresh) {
                try {
                    window.localStorage.setItem("REFRESH_TOKEN", JSON.stringify(newRefresh));
                    console.log('[Axios] REFRESH_TOKEN saved');
                } catch (e) {
                    console.error('[Axios] Failed to save REFRESH_TOKEN:', e);
                }
            }

            isRefreshing = false;

            processQueue(null, newAccess ?? null);

            // Retry original request with new token
            if (!originalRequest) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;
            if (newAccess) {
                originalRequest.headers = originalRequest.headers ?? {};
                originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            }

            console.log('[Axios] Retrying original request...');
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            console.error('[Axios] Refresh failed:', refreshError);
            isRefreshing = false;
            processQueue(refreshError, null);
            try {
                window.localStorage.removeItem("ACCESS_TOKEN");
                window.localStorage.removeItem("REFRESH_TOKEN");
            } catch {
                // Ignore storage errors during forced logout.
            }
            window.location.href = '/login';
            return Promise.reject(refreshError);
        }
    },
);

export default axiosInstance;
