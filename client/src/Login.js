import React, { useState } from 'react';
import api from './API/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // ✅ Import the new styles

const Login = () => {
    const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const endpoint = isLogin ? '/Auth/login' : '/Auth/register';
            
            // 1. Send Request
            const response = await api.post(endpoint, { username, password });

            if (isLogin) {
                // 2. Login Logic: Save Token & Redirect
                localStorage.setItem('token', response.data.token);
                navigate('/chat');
            } else {
                // 3. Register Logic: Switch to login view after success
                alert("Registration Successful! Please login.");
                setIsLogin(true);
            }

        } catch (err) {
            setError(err.response?.data || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
               <h2>{isLogin ? "System Access" : "New User Registration"}</h2>
                <p>{isLogin ? "Enter your credentials to access your AI Assistant" : "Join us to start chatting with AI"}</p>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Enter username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Enter password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>

                    <button type="submit" className="login-btn">
                        {isLogin ? "Login" : "Sign Up"}
                    </button>
                </form>

                <div className="toggle-link">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span onClick={() => { setIsLogin(!isLogin); setError(''); }}>
                        {isLogin ? "Sign Up" : "Login"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;