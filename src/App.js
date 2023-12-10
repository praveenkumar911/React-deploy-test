// App.js
import React, { useState } from 'react';
import Signup from './Signup';
import Login from './Login';
import DataDisplay from './DataDisplay';

const App = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);

  const handleSignup = async (formData) => {
    try {
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Signup successful');
        window.location.reload()
        // You can handle success (e.g., show a success message, redirect, etc.)
      } else {
        console.error('Signup failed');
        // Handle failure (e.g., show an error message)
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  const handleLogin = async (formData) => {
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const userData = await response.json();
        //console.log('afuigr',userData)
        setUser(userData);

        // Fetch data using the obtained token
        const dataResponse = await fetch('http://localhost:3001/data', {
          headers: {
            'Authorization': userData.token,
          },
        });

        if (dataResponse.ok) {
          const data = await dataResponse.json();
          setData(data);
         // console.log(data)
          console.log('Data fetch successful');
        } else {
          console.error('Data fetch failed');
          // Handle failure to fetch data
        }

        console.log('Login successful');
        // You can handle success (e.g., show a success message, redirect, etc.)
      } else {
        console.error('Login failed');
        // Handle failure (e.g., show an error message)
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleLogout = () => {
    // Implement logout logic, e.g., clear user data or invalidate the token
    setUser(null);
    setData(null);
  };

  return (
    <div>
      {user ? (
        <DataDisplay userData={user} data={data} onLogout={handleLogout} />
      ) : (
        <>
          <Signup onSignup={handleSignup} />
          <Login onLogin={handleLogin} />
        </>
      )}
    </div>
  );
};

export default App;
