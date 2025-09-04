// https://chat-video-call-app-backend-git-main-loc2k3iuhs-projects.vercel.app/

import axios from 'axios';

// const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5001/api' : 'https://chat-video-call-app-backend-git-main-loc2k3iuhs-projects.vercel.app/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URl;

export const axiosInstance = axios.create({
 baseURL: BASE_URL,
 withCredentials: true,
 
});