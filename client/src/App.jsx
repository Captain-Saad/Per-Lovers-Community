import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Pets from './components/Pets';
import CreatePost from './components/CreatePost';
import Login from './components/Login';
import Register from './components/Register';
import AboutUs from './components/AboutUs';
import UserProfile from './components/UserProfile';
import './index.css';
import { useContext } from 'react';
import PawLoading from './assets/paw_loading.gif';

const App = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img src={PawLoading} alt="Loading..." className="w-32 h-32" />
      </div>
    );
  }

  return (
    <Router key={user ? user._id : 'logged-out'}>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pets" element={<Pets key={user?._id || 'logged-out'} />} />
            <Route path="/about" element={<AboutUs />} />
            <Route
              path="/create-post"
              element={user ? <CreatePost /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/edit-post/:postId"
              element={user ? <CreatePost /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/profile"
              element={user ? <UserProfile key={user?._id || 'logged-out'} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" replace />}
            />
            <Route
              path="/register"
              element={!user ? <Register /> : <Navigate to="/" replace />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;