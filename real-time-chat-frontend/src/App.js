import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../src/components/Login';
import Register from './components/Register';
import ProtectedRoute from '../src/ProtectedRoute';  // Import your Protected Route
import Chat from './components/Chat';  

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/protected" element={<ProtectedRoute />} />  
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;

