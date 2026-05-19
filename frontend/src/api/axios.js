import axios from 'axios'

const api = axios.create({
    baseURL: 'https://proyecto2-web-production.up.railway.app',
})

export default api