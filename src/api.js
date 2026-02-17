// Auto add access token to request header jaaaaa
import axios from 'axios';
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.log('Request error:', error);
        return Promise.reject(error);
    }
);
 
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Token หมดอายุ หรือ ไม่ถูกต้อง");
            localStorage.removeItem('access_token');
            window.location.href = '/signin'; 
        }
        return Promise.reject(error);
    }
);

export default api;
