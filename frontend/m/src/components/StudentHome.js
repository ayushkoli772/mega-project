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
    try {
      // Add student's message to AI mentor chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: query, sender: 'student' },
      ]);
      // Simulating AI response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'AI Mentor: Let me help you with that!', sender: 'mentor' },
        ]);
      }, 1000); // Simulating delay for AI response

      await axios.post(
        'http://localhost:5000/api/students/query',
        { question: query },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Query submitted successfully!');
      setQuery('');
    } catch (err) {
      console.error(err.message);
      alert('Error submitting query.');
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
        <h2>Chat with AI Mentor</h2>
        <div className="chat-box">
          <div className="messages-container">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.sender === 'student' ? 'student-message' : 'mentor-message'}`}
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
