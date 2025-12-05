import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Chat from './Chat';

// Protected Route Component
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route 
                    path="/chat" 
                    element={
                        <PrivateRoute>
                            <Chat />
                        </PrivateRoute>
                    } 
                />
            </Routes>
        </Router>
    );
}

export default App;