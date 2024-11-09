import React from 'react';
import { Routes, Route, Router } from 'react-router-dom';
import HomePage from '../pages/index';
import RegisterPage from '../pages/register';
import IndexPage from '../pages/index';
import LoginPage from '../pages/login';
// import ErrorPage from '../pages/error';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default App;