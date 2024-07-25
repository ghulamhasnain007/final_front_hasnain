import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://saylaniportalback-production.up.railway.app/api', // Replace with your API base URL
});

// Add a request interceptor to include the token in the headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage (or any other storage)
    const techerdata = JSON.parse(localStorage.getItem('techerdata'))
   const token = techerdata.token
    // console.log(token);
    // If the token exists, include it in the headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default axiosInstance;
