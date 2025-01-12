import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Ensure this matches the backend port
});

export default api;
