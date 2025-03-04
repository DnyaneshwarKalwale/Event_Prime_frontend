import axios from 'axios';


const axiosInstance = axios.create({ baseURL: 'https://event-backend-9492.onrender.com/' });


axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
