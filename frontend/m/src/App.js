import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Register from './components/Register';
import MentorHome from './components/MentorHome';
import StudentHome from './components/StudentHome';
import Index from './components/home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mentor/home" element={<MentorHome />} />
        <Route path="/student/home" element={<StudentHome />} />
      </Routes>
    </Router>
  );
}

export default App;
