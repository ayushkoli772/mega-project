import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MentorHome = () => {
  const [queries, setQueries] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/mentors/queries', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQueries(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchQueries();
  }, [token]);

  return (
    <div>
      <h1>Mentor Dashboard</h1>
      {queries.length === 0 ? (
        <p>No queries available.</p>
      ) : (
        <ul>
          {queries.map((query) => (
            <li key={query._id}>
              <strong>{query.studentName}</strong>: {query.question}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MentorHome;
