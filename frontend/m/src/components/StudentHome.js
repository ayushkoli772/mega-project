import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StudentHome.css';  // Include custom styling

const StudentHome = () => {
  const [mentors, setMentors] = useState([]);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);  // Track messages for AI mentor chat
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/students/mentors', {
          headers: { Authorization: `Bearer ${token}` },
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

    // Add user query to the chat UI
    const newMessages = [
      ...messages,
      { role: "user", text: query },
    ];
    setMessages(newMessages);
    setQuery("");

    try {
      const response = await axios.post("http://localhost:5000/api/students/ai-chat", { question: query });

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
      
      <section className="mentors-section">
        
        <ul className="mentor-list">
          {mentors.map((mentor) => (
            <li key={mentor._id} className="mentor-item">
              <p className="mentor-name">{mentor.name}</p>
              <p className="mentor-email">{mentor.email}</p>
            </li>
          ))}
        </ul>
      </section>

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
