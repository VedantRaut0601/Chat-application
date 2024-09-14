import axios from 'axios';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';  // Import Navigate for redirection

const ProtectedRoute = ({ children }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  
  const token = localStorage.getItem('token');  // Get JWT token from localStorage

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;  // Prevent fetching if no token exists

      try {
        const response = await axios.get('http://localhost:5000/api/protected', {
          headers: {
            'auth-token': token  // Attach the token to the request headers
          }
        });
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch protected data.');
        console.error(err);
      }
    };

    fetchData();
  }, [token]);  // Add token to dependency array

  // If no token is found, redirect to the login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h2>Protected Data</h2>
      {error && <p>{error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {children}  {/* Render children components if provided */}
    </div>
  );
};

export default ProtectedRoute;
