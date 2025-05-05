import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './StudentHome.css';  

const StudentHome = () => {
  const [mentors, setMentors] = useState([]);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messageEndRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // const mentorsResponse = await axios.get('http://localhost:5000/api/students/mentors', {
        //   withCredentials: true,
        // });
        // setMentors(mentorsResponse.data);
        
        const conversationResponse = await axios.get('http://localhost:5000/api/students/conversations', {
          withCredentials: true,
        });
        
        if (conversationResponse.data.messages.length > 0) {
          setMessages(conversationResponse.data.messages);
        }
      } catch (err) {
        console.error('Error fetching data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    
    const newMessages = [
      ...messages,
      { role: "user", text: query },
    ];
    setMessages(newMessages);
    setQuery("");

    try {
      const response = await axios.post("http://localhost:5000/api/students/ai-chat", { question: query },{withCredentials: true});

      const aiMessage = response.data.response;
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: aiMessage },
      ]);
    } catch (error) {
      console.error("Error communicating with the AI:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, something went wrong. Please try again." },
      ]);
    }
  };

  return (
    <div className="student-home-container">
      <h1 className="dashboard-title">Student Dashboard</h1>

      <section className="chat-section">
        <h2>Chat</h2>
        <div className="chat-box">
          <div className="messages-container">
            {loading ? (
              <div className="loading-message">Loading conversation history...</div>
            ) : messages.length === 0 ? (
              <div className="welcome-message">
                Hello! How can I help you today?
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.role === "user" ? "user-message" : "assistant-message"}`}
                >
                  {message.text}
                </div>
              ))
            )}
            <div ref={messageEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="chat-form">
            <textarea
              className="message-input"
              placeholder="Type your message here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
            <button type="submit" className="submit-btn">Send</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default StudentHome;
