import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../userPageCss/productList.css';
import ProductCard from '../userPageComponents/productCard';
import Spinner from '../components/spinner';
import UserNavBar from '../userPageComponents/navBarUserPage.jsx';
import SearchProductByType from '../components/searchProductByType.jsx';

const ProductList = () => {
  const { restaurantId } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState(''); // State for selected food type
  const [isChatOpen, setIsChatOpen] = useState(false); // State to toggle chatbot popup
  const [chatMessages, setChatMessages] = useState([]); // State for chatbot messages
  const [userMessage, setUserMessage] = useState(''); // State for the current user input
  const [isBotThinking, setIsBotThinking] = useState(false); // State to show "thinking" message
  const chatBodyRef = useRef(null); // Ref for auto-scrolling
  const [history, setHistory] = useState([]); // History to store the chat context

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `https://dreamsdeluxeapi.azurewebsites.net/client/getproducts/${restaurantId}`
        );
        setProducts(response.data);
        setFilteredProducts(response.data); // Initially show all products
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [restaurantId]);

  // Function to handle filtering based on the selected food type
  const handleFilterByType = (typeName) => {
    setSelectedType(typeName);

    // Filter products by the type property
    if (typeName) {
      const filtered = products.filter((product) => product.type === typeName);
      setFilteredProducts(filtered);
    } else {
      // If no type selected, show all products
      setFilteredProducts(products);
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return; // Prevent sending empty messages
    console.log('Sending message:', history); // Debug log

    // Add the user message to the chat and history
    const newUserMessage = {
      role: 'user',
      content: userMessage,
    };
    setChatMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setHistory((prevHistory) => [...prevHistory, { role: 'user', content: userMessage }]);
    setUserMessage(''); // Clear the input field

    // Set the bot thinking state to true
    setIsBotThinking(true);

    try {
      // Send the history with the user message to the API
      const response = await axios.post(
        `http://127.0.0.1:8000/client/restaurant_chat_engine/${restaurantId}`,
        { question: userMessage, history: history }
      );

      console.log('API Response:', response.data); // Debug log

      const botReply = response.data.response;

      // Add the bot's response to the chat and history
      const botMessage = {
        role: 'assistant',
        content: botReply,
      };

      setChatMessages((prevMessages) => [...prevMessages, botMessage]);
      setHistory((prevHistory) => [...prevHistory, { role: 'assistant', content: botReply }]);
    } catch (error) {
      console.error('Error communicating with chatbot:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Unable to connect to the chatbot. Please try again later.',
      };
      setChatMessages((prevMessages) => [...prevMessages, errorMessage]);
      setHistory((prevHistory) => [...prevHistory, { assistant: errorMessage.content }]);
    } finally {
      // Set the bot thinking state to false after receiving the response
      setIsBotThinking(false);
    }
  };

  // Auto-scroll chat to the latest message
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages]);

  if (loading) return <Spinner />;

  return (
    <>
      <SearchProductByType adminId={restaurantId} onFilter={handleFilterByType} />
      {isChatOpen && <div className="background-chatpage"></div>}
      <div className="menu-container">
        <div className="product-container">

          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                productId={product._id}
                imageUrl={product.imageUrl}
                description={product.description} 
                price={product.price}
                name={product.name}
              />
            ))
          ) : (
            <p>No products found for this type.</p> // Message when no products found
          )}
        </div>
      </div>

      {/* Chatbot Icon */}
      <img
        src="https://dreamsblob.blob.core.windows.net/appimages/chatbotavatar.jpg"
        alt="Chatbot"
        className="chat-bot-user"
        onClick={() => setIsChatOpen(!isChatOpen)} // Toggle chatbot popup
      />

      {/* Chatbot Popup */}
      {isChatOpen && (
        <div className="chatbot-popup">
          <div className="chatbot-header">
            <h3>Luna</h3>
            <button onClick={() => setIsChatOpen(false)} className="close-chat-user">&times;</button>
          </div>
          <div className="chatbot-body" ref={chatBodyRef}>
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
              >
                {message.content}
              </div>
            ))}
            {isBotThinking && (
              <div className="chat-message bot-message thinking-message">
                Thinking...
              </div>
            )}
          </div>
          <div className="chatbot-footer">
            <input
              type="text"
              placeholder="Type your message..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <p className="chatbot-send-button-user" onClick={handleSendMessage}>
              ➤
            </p>
          </div>
        </div>
      )}

      <UserNavBar />
    </>
  );
};

export default ProductList;