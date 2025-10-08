// frontend/src/components/LoadingSpinner.jsx
import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = () => {
    return (
        <div className="spinner-container">
            <div className="loading-spinner"></div>
            <p>Inicializando o servidor, por favor aguarde...</p>
            <p>(Isso pode levar até 40 segundos na primeira visita)</p>
        </div>
    );
};

export default LoadingSpinner;
