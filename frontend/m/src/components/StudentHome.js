import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StudentHome.css';  

const StudentHome = () => {
  const [mentors, setMentors] = useState([]);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/students/mentors', {
          withCredentials: true,
        });
        setMentors(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchMentors();
  }, [token]);

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
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role === "user" ? "user-message" : "assistant-message"}`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="chat-form">
          <textarea
            className="message-input"
            placeholder="Type your query here..."
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
