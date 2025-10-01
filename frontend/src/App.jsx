// frontend/src/App.jsx

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import KanbanBoard from "./pages/KanbanBoard";
import SignUpPage from "./pages/SignUpPage"; // 1. Importe a nova página

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("access_token");
    return token ? children : <Navigate to="/login" />;
};

// --- NOVO COMPONENTE: Rota Padrão Inteligente ---
const DefaultRoute = () => {
    const token = localStorage.getItem('access_token');
    // Se tiver token, a página padrão é /admin.
    // Se NÃO tiver token, a página padrão é /login.
    return token ? <Navigate to="/admin" /> : <Navigate to="/login" />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                {/* 2. Adicione a rota para a página de cadastro */}
                <Route path="/signup" element={<SignUpPage />} />
                <Route
                    path="/admin"
                    element={
                        <PrivateRoute>
                            <KanbanBoard />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<DefaultRoute />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
