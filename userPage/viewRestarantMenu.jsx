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
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isBotThinking, setIsBotThinking] = useState(false);
  const chatBodyRef = useRef(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `https://dreamsdeluxeapi.azurewebsites.net/client/getproducts/${restaurantId}`
        );
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [restaurantId]);

  const handleFilterByType = (typeName) => {
    setSelectedType(typeName);
    if (typeName) {
      const filtered = products.filter((product) => product.type === typeName);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;
    console.log('Sending message:', history);

    const newUserMessage = { role: 'user', content: userMessage };
    setChatMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setHistory((prevHistory) => [...prevHistory, newUserMessage]);
    setUserMessage('');
    setIsBotThinking(true);

    try {
      const response = await axios.post(
        `https://lunalicentai-5854dda4045a.herokuapp.com/client/restaurant_chat_engine/${restaurantId}`,
        { question: userMessage, history: history }
      );

      console.log('API Response:', response.data);
      const botReply = response.data.response;
      const botMessage = { role: 'assistant', content: botReply };

      setChatMessages((prevMessages) => [...prevMessages, botMessage]);
      setHistory((prevHistory) => [...prevHistory, botMessage]);
    } catch (error) {
      console.error('Error communicating with chatbot:', error);
      const errorMessage = { role: 'assistant', content: 'Unable to connect to the chatbot. Please try again later.' };
      setChatMessages((prevMessages) => [...prevMessages, errorMessage]);
      setHistory((prevHistory) => [...prevHistory, { assistant: errorMessage.content }]);
    } finally {
      setIsBotThinking(false);
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Prevent background scrolling when chatbot is open
  useEffect(() => {
    if (isChatOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isChatOpen]);

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
            <p className='search-products-category'>No products found for this type.</p>
          )}
        </div>
      </div>

      <img
        src="https://dreamsblob.blob.core.windows.net/appimages/chatbotavatar.jpg"
        alt="Chatbot"
        className="chat-bot-user"
        onClick={() => setIsChatOpen(!isChatOpen)}
      />

      {isChatOpen && (
        <div className="chatbot-popup">
          <div className="chatbot-header">
            <h3>Luna</h3>
            <button onClick={() => setIsChatOpen(false)} className="close-chat-user">&times;</button>
          </div>
          <div className="chatbot-body" ref={chatBodyRef}>
            {chatMessages.map((message, index) => (
              <div key={index} className={`chat-message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}>
                {message.content}
              </div>
            ))}
            {isBotThinking && <div className="chat-message bot-message thinking-message">Thinking...</div>}
          </div>
          <div className="chatbot-footer">
            <input
              type="text"
              placeholder="Type your message..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <p className="chatbot-send-button-user" onClick={handleSendMessage}>➤</p>
          </div>
        </div>
      )}

      <UserNavBar />
    </>
  );
};

export default ProductList;
