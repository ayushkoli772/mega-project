import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Index = () => {
  return (
    <div className="index-container">
      <div className="welcome-banner">
        <h1>Welcome to Mentor Connect</h1>
        <p>Connecting students with mentors to achieve their goals.</p>
      </div>
      <div className="action-buttons">
        <Link to="/login" className="btn btn-login">Login</Link>
        <Link to="/register" className="btn btn-register">Register</Link>
      </div>
    </div>
  );
};

export default Index;
