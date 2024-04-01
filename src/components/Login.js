// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login = () => {
  const navigate = useNavigate();
  const [uid, setUID] = useState('');

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLoginClick = async () => {
    try {
      const response = await fetch('https://jellybackend.vercel.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid }), // Send the entered UID to the backend
      });

      if (response.ok) {
        // Set cookie upon successful login
        Cookies.set('isLoggedIn', 'true', { expires: 1 }); // Cookie expires in 1 day

        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl mb-4">Login</h1>
        <input
          type="text"
          placeholder="Enter UID"
          value={uid}
          onChange={(e) => setUID(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:border-blue-500"
        />
        <div className="flex justify-between items-center">
          <button 
            className="px-4 py-2 text-white bg-blue-500 rounded-md focus:outline-none hover:bg-blue-600"
            onClick={handleLoginClick}
          >
            Login
          </button>
          <button 
            className="px-4 py-2 text-blue-500 bg-white border border-blue-500 rounded-md focus:outline-none hover:text-white hover:bg-blue-500"
            onClick={handleRegisterClick}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
