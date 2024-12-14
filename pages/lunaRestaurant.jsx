import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../css/lunaRestaurant.css';
import SidebarAdmin from '../components/sidebarAdmin';

const LunaRestaurantChatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasAskedQuestion, setHasAskedQuestion] = useState(false); 

    // Reference to the messages end div for auto-scroll
    const messagesEndRef = useRef(null);

    const quickQuestions = [
        "Cum ar trebui sa interactionez cu tine?",
        "Cine esti tu?",
        "Ce poti sa faci?",
        "Cum functionezi?"
    ];

    const sendMessage = async (question) => {
        if (question.trim()) {
            const newUserMessage = { text: question, sender: 'user' };
            setMessages((prevMessages) => [...prevMessages, newUserMessage]);
            const updatedHistory = [];
            setInput(''); // Clear the input
            setLoading(true);
            setHasAskedQuestion(true); 

            try {

                const response = await axios.post('http://127.0.0.1:8000/client/chat_engine', {
                    question: question,
                    history: updatedHistory
                });

                const botResponse = response.data.response;
                const responseHistory = response.data.history || updatedHistory;

                const newBotMessage = { text: botResponse, sender: 'bot' };
                setMessages((prevMessages) => [...prevMessages, newBotMessage]);
                setHistory(responseHistory);
            } catch (error) {
                console.error('API error:', error);
                const errorMessage = { text: "Oops! Something went wrong. Please try again.", sender: 'bot' };
                setMessages((prevMessages) => [...prevMessages, errorMessage]);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSend = () => {
        sendMessage(input);
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <>
            <SidebarAdmin />
            <div className="chatbot-container">

               

                {/* Chat Messages */}
                <div className="chatbot-messages">
                    {messages.map((message, index) => (
                        <div key={index} className={`message-wrapper ${message.sender}`}>
                            {message.sender === 'bot' && (
                                <img src="../images/chatbotavatar.jpg" alt="avatar" className="avatar avatar-img" />
                            )}
                            <div className={`message ${message.sender}`}>
                                <div>{message.text}</div>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="message-wrapper bot">
                            <img src="../images/chatbotavatar.jpg" alt="avatar" className="avatar" />
                            <div className="message bot">Luna is typing...</div>
                        </div>
                    )}

                    {/* Empty div to scroll into view */}
                    <div ref={messagesEndRef} />
                    {!hasAskedQuestion && (
                    <div className="quick-questions-container">
                        {quickQuestions.map((question, index) => (
                            <button
                                key={index}
                                className="quick-question-button"
                                onClick={() => sendMessage(question)}
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                )}
                    
                </div>
                <div className="input-back">
                    <div className="chatbot-input-container">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type a message..."
                                className="chatbot-input"
                            />
                        <p onClick={handleSend} className="chatbot-send-button" >
                                ➤
                            </p>

                    </div>
                </div>
                
            </div>
        </>
    );
};

export default LunaRestaurantChatbot;
