import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MentorHome.css';
const MentorHome = () => {
  const [queries, setQueries] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/mentors/queries', {withCredentials: true });
        setQueries(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchQueries();
  }, [token]);

  return (
    <div className="mentor-home-container">
      <h1 className="dashboard-title">Mentor Dashboard</h1>
      <section className="queries-section">
        {queries.length === 0 ? (
          <p className="no-queries">No queries available.</p>
        ) : (
          <div className="queries-list">
            {queries.map((query) => (
              <div key={query._id} className="query-card">
                <div className="query-header">
                  <span className="student-name"><strong>{query.studentName}</strong></span>
                </div>
                <div className="query-body">
                  <p className="query-text">{query.Emotional_score}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MentorHome;
