import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentHome = () => {
  const [mentors, setMentors] = useState([]);
  const [query, setQuery] = useState('');
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
    <div>
      <h1>Student Dashboard</h1>
      <h2>Available Mentors</h2>
      <ul>
        {mentors.map((mentor) => (
          <li key={mentor._id}>{mentor.name} - {mentor.email}</li>
        ))}
      </ul>
      <h2>Post a Query</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Type your query here..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button type="submit">Submit Query</button>
      </form>
    </div>
  );
};

export default StudentHome;
