import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check if 'isLoggedIn' cookie exists
    const isLoggedInCookie = Cookies.get('isLoggedIn');
    if (isLoggedInCookie === 'true') {
      setIsLoggedIn(true);
      // Fetch user data from backend
      fetchUserData();
    } else {
      // Redirect to login page if cookie doesn't exist
      navigate('/login');
    }
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      // Fetch user data from backend using API
      const response = await fetch('https://jellybackend.vercel.app/api/data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUserData(userData);
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const handleLogout = () => {
    // Clear the isLoggedIn cookie
    Cookies.remove('isLoggedIn');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg flex flex-col">
        <div className="flex justify-between items-center bg-gray-200 p-4 rounded-t-lg">
          <h1 className="text-3xl">Dashboard Page</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-full mr-4"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        <div className="flex justify-center items-center mt-4">
          {/* User profile image placeholder */}
          <div
            className="w-48 h-48 bg-gray-200 rounded-full flex justify-center items-center"
          >
            <p className="text-gray-500 text-xl">User Image</p>
          </div>
        </div>
        <div className="mt-8">
          {isLoggedIn && userData && (
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <p>UID: {userData.uid}</p>
              <p>Name: {userData.name}</p>
              <p>Email: {userData.email}</p>
              <p>Phone: {userData.phone}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
