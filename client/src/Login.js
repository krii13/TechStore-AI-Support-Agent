import React, { useState } from 'react';
import api from './API/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // ✅ 1. Add Loading State
    const navigate = useNavigate();

    // ✅ 2. Validation Function
    const validateForm = () => {
        if (username.trim().length < 3) {
            setError("Username must be at least 3 characters long.");
            return false;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Run validation before API call
        if (!validateForm()) return;

        setLoading(true); // Start Loading

        try {
            const endpoint = isLogin ? '/Auth/login' : '/Auth/register';

            const response = await api.post(endpoint, { username, password });

            if (isLogin) {
                localStorage.setItem('token', response.data.token);
                navigate('/chat');
            } else {
                alert("Registration Successful! Please login.");
                setIsLogin(true);
                setUsername('');
                setPassword('');
            }

        } catch (err) {
            // ✅ 3. Specific Error Message Handling
            // This grabs the "Username is already taken" string from your C# backend
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false); // Stop Loading (always runs)
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>{isLogin ? "System Access" : "New User Registration"}</h2>
                <p>{isLogin ? "Enter your credentials to access your AI Assistant" : "Join us to start chatting with AI"}</p>

                {/* This uses the CSS class .error-msg for red font */}
                {error && <div className="error-msg">⚠️ {error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setError(''); // Clear error when typing
                            }}
                            required
                            disabled={loading} // Disable input during load
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError(''); // Clear error when typing
                            }}
                            required
                            disabled={loading} // Disable input during load
                        />
                    </div>

                    {/* Button changes text and disables when loading */}
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? "Processing..." : (isLogin ? "Login" : "Sign Up")}
                    </button>
                </form>

                <div className="toggle-link">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span onClick={() => {
                        if (!loading) { // Prevent switching while loading
                            setIsLogin(!isLogin);
                            setError('');
                            setUsername('');
                            setPassword('');
                        }
                    }}>
                        {isLogin ? "Sign Up" : "Login"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;