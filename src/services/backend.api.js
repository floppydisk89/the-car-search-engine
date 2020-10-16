import axios from 'axios';

const api = axios.create({
    baseURL: 'https://arcane-scrubland-64110.herokuapp.com',
});

export default api;