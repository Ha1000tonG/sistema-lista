// frontend/src/api/api.js lida com chamadas de API e interceptores

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
    baseURL: API_URL,
});

// Interceptor de Requisição (permanece o mesmo)
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

// --- INTERCEPTOR DE RESPOSTA CORRIGIDO ---
apiClient.interceptors.response.use(
    (response) => response, // Sucesso: não faz nada
    (error) => {
        // Verifica se o erro é 401 E se a requisição NÃO foi para o endpoint /token
        if (error.response && error.response.status === 401 && error.config.url !== '/token') {
            // Isso significa que é uma sessão expirada em uma página protegida
            localStorage.setItem('logout_message', 'Sua sessão expirou. Por favor, faça o login novamente.');
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        }
        // Para todos os outros erros (incluindo falha de login no /token),
        // apenas rejeita a promessa para que o .catch() local possa lidar com eles.
        return Promise.reject(error);
    }
);

export default apiClient;