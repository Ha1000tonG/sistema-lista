// frontend/src/api/api.js

import axios from 'axios';

// Lê a URL da API a partir das variáveis de ambiente do Vite.
// Se não encontrar, usa a URL local como padrão.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
    baseURL: API_URL,
});

// Interceptor que adiciona o token a cada requisição
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor que lida com sessões expiradas (erro 401)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.setItem('logout_message', 'Sua sessão expirou. Por favor, faça o login novamente.');
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;