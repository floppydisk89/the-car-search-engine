import axios from 'axios';

const api = axios.create({
    baseURL: 'https://opendata.rdw.nl/resource/',
});

export default api;