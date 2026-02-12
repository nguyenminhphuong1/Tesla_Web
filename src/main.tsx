import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './i18n';
import './styles/main.css';
import './styles/components.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  rootElement.innerHTML = `
    <div style="
      background: #0a0a0f; 
      color: white; 
      height: 100vh; 
      display: flex; 
      flex-direction: column;
      align-items: center; 
      justify-content: center;
      font-family: Arial, sans-serif;
      padding: 2rem;
    ">
      <h1 style="color: #00d4ff; font-size: 3rem; margin-bottom: 1rem;"> Thadorobot</h1>
      <p style="font-size: 1.2rem; margin-bottom: 2rem;">Website 3D tương tác</p>
      <div style="
        background: rgba(255,255,255,0.1); 
        padding: 2rem; 
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,0.2);
        max-width: 500px;
        text-align: center;
      ">
        <h2>⚠️ Có lỗi xảy ra</h2>
        <p>Vui lòng kiểm tra console để xem chi tiết lỗi.</p>
        <button onclick="window.location.reload()" style="
          background: #00d4ff;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 1rem;
        ">
          Tải lại trang
        </button>
      </div>
    </div>
  `;
} 