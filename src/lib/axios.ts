import axios, {
    AxiosError,
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosResponse
} from 'axios';

// Base configuration
const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api` : '/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Send cookies with requests
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Here you can inject headers, tokens, etc.
        // Example:
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error: AxiosError) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Queue to hold requests while token is refreshing
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response) {
            // 401 Handling: Refresh Token
            if (error.response.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise(function (resolve, reject) {
                        failedQueue.push({ resolve, reject });
                    })
                        .then(() => {
                            return axiosInstance(originalRequest);
                        })
                        .catch((err) => {
                            return Promise.reject(err);
                        });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    // Attempt to refresh the token
                    await axiosInstance.post('/auth/refresh');

                    // If successful, process queue and retry original request
                    processQueue(null, 'success');
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    // If refresh fails, process queue with error
                    processQueue(refreshError, null);

                    console.error('Token refresh failed:', refreshError);
                    // Redirect to login or handle session expiry
                    if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
                        // Optional: Redirect to login
                        // window.location.href = '/auth/login'; 
                    }
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            console.error('Response Error:', error.response.status, error.response.data);

            switch (error.response.status) {
                case 403:
                    // Handle forbidden
                    console.error('Forbidden - You do not have permission to access this resource.');
                    break;
                case 404:
                    console.error('Resource not found.');
                    break;
                case 500:
                    console.error('Internal Server Error.');
                    break;
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error setting up request:', error.message);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
