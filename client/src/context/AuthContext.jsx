import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext useEffect: checking token...');
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data._id) {
            console.log('AuthContext useEffect: Setting user from /me endpoint, data:', data);
            setUser(data);
            console.log('AuthContext useEffect: User state after set (from /me):', user, 'User._id:', data._id);
          } else {
            console.warn('No user data received from /api/auth/me, removing token.', data);
            localStorage.removeItem('token');
            setUser(null); // Explicitly set user to null if no data
          }
        })
        .catch(error => {
          console.error('Error fetching user in useEffect:', error);
          localStorage.removeItem('token');
          setUser(null); // Explicitly set user to null on error
        });
    } else {
      // No token found, so we are not loading user
      setLoading(false);
      console.log('AuthContext useEffect: No token found. Loading set to false. Current user (else block):', user, 'Token present:', !!token);
    }
  }, []);

  // This useEffect will run when the `user` state updates
  useEffect(() => {
    if (user !== null) {
      // User has been set (either from /me or login/register)
      setLoading(false);
      console.log('AuthContext useEffect: User state updated, setting loading to false. Current user:', user);
    } else if (!localStorage.getItem('token') && loading) {
      // No user and no token, and still loading means it's an initial load without login
      setLoading(false);
      console.log('AuthContext useEffect: No user and no token, setting loading to false.');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);
      console.log('AuthContext Login: User object set from login:', data.user, 'User._id:', data.user ? data.user._id : 'N/A');
      return data;
    } catch (error) {
      console.error('AuthContext Login: Error during login:', error);
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);
      console.log('AuthContext Register: User object set from register:', data.user, 'User._id:', data.user ? data.user._id : 'N/A');
      return data;
    } catch (error) {
      console.error('AuthContext Register: Error during registration:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    console.log('AuthContext Logout: User set to null.');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 