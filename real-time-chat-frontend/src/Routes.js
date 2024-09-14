import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import ProtectedRoute from './ProtectedRoute';  // Import ProtectedRoute

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protect the /chat route with ProtectedRoute */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />  {/* Render Chat component only if authenticated */}
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
