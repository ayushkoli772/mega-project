import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import MentorHome from './components/MentorHome';
import StudentHome from './components/StudentHome';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mentor/home" element={<MentorHome />} />
        <Route path="/student/home" element={<StudentHome />} />
      </Routes>
    </Router>
  );
}

export default App;
