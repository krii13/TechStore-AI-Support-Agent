import React, { useState, useEffect, useRef } from 'react';
import api from './API/axiosConfig';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'; // ✅ IMPORTS MARKDOWN
import './Chat.css'; // ✅ IMPORTS CSS

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => { fetchHistory(); }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchHistory = async () => {
        try {
            const res = await api.get('/Chat/history');
            setMessages(res.data);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('token');
                navigate('/');
            }
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { content: input, isBot: false, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        
        const currentInput = input;
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/Chat/send', { userMessage: currentInput });
            const botMsg = { 
                content: res.data.response, 
                isBot: true, 
                timestamp: new Date(),
                products: res.data.products 
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (err) {
            console.error("Error", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-container">
            {/* Header */}
            <div className="chat-header">
                <h3>🛍️ TechStore AI Support</h3>
                <button className="logout-btn" onClick={() => { localStorage.removeItem('token'); navigate('/'); }}>
                    Logout
                </button>
            </div>

            {/* Messages Area */}
            <div className="messages-area">
                {messages.map((msg, index) => (
                    <div key={index} className={`message-wrapper ${msg.isBot ? 'bot' : 'user'}`}>
                        
                        {/* Message Bubble with Markdown */}
                        <div className="bubble">
                            {msg.isBot ? (
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            ) : (
                                msg.content
                            )}
                        </div>

                        {/* Product Cards */}
                        {msg.isBot && msg.products && msg.products.length > 0 && (
                            <div className="product-carousel">
                                {msg.products.map(p => (
                                    <div key={p.id} className="product-card">
                                        <img 
                                            src={p.imageUrl || p.ImageUrl || p.image}
                                            alt={p.name} 
                                            className="product-image"
                                            onError={(e) => { e.target.src = 'https://placehold.co/150?text=No+Image' }}
                                        />
                                        <div className="product-name" title={p.name}>{p.name}</div>
                                        <div className="product-price">${p.price}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <span className="timestamp">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}

                {loading && <div className="message-wrapper bot"><div className="bubble">Thinking...</div></div>}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="input-area">
                <input 
                    type="text" 
                    className="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    disabled={loading}
                />
                <button className="send-btn" onClick={sendMessage} disabled={loading}>
                    ➤
                </button>
            </div>
        </div>
    );
};

export default Chat;