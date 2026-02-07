import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { initializeDatabase } from './db/database';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';

// Initialize database with seed data if empty
initializeDatabase().then(() => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}).catch((error) => {
    console.error('Failed to initialize database:', error);
    // Still render the app, but show error
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
});
