import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Products from './components/Products';
import Login from './components/Login';
import Setup from './components/Setup';

const App: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status on component mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAdmin(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/auth/verify`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error('Error verifying admin status:', error);
        setIsAdmin(false);
        localStorage.removeItem('token');
      }
    };

    checkAdminStatus();
  }, []);

  const handleLogin = (adminStatus: boolean) => {
    setIsAdmin(adminStatus);
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAdmin(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar
          isAdmin={isAdmin}
          onLoginClick={() => setIsLoginOpen(true)}
          onLogout={handleLogout}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products isAdmin={isAdmin} />} />
          <Route path="/setup" element={<Setup />} />
          <Route
            path="/showcases"
            element={
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Showcases</h1>
                <p>Showcases content will be added here.</p>
              </div>
            }
          />
        </Routes>
        <Login
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLogin={handleLogin}
        />
      </div>
    </Router>
  );
};

export default App;
