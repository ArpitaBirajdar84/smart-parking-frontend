import axios from 'axios';

const api = axios.create({
  baseURL: 'https://smart-parking-backend-pjsc.onrender.com', 
});

export default api;
