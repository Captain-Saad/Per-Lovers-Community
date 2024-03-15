import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import PawLoading from '../assets/paw_loading.gif';

const API_URL = 'http://localhost:5000';

const UserProfile = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [userPosts, setUserPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState(null);
  const navigate = useNavigate();

  console.log('UserProfile render:', { user, authLoading, postsLoading });

  const fetchUserData = async () => {
    console.log('fetchUserData called with user:', user);
    if (!user || !user._id) {
      console.log('No user or user._id, skipping fetch');
      setPostsLoading(false);
      return;
    }

    try {
      setPostsLoading(true);
      setPostsError(null);

      console.log('Fetching user posts for:', user._id);
      // Fetch user's posts
      const postsResponse = await fetch(`${API_URL}/api/pet-posts/user/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!postsResponse.ok) {
        const errorData = await postsResponse.json();
        console.error('Error fetching user posts API response:', errorData);
        throw new Error(errorData.message || 'Failed to fetch user posts');
      }

      const postsData = await postsResponse.json();
      console.log('User posts fetched successfully:', postsData.length, 'posts.');
      setUserPosts(postsData);

      console.log('Fetching saved posts...');
      // Fetch saved posts
      const savedResponse = await fetch(`${API_URL}/api/pet-posts/saved`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!savedResponse.ok) {
        const errorData = await savedResponse.json();
        console.error('Error fetching saved posts API response:', errorData);
        throw new Error(errorData.message || 'Failed to fetch saved posts');
      }

      const savedData = await savedResponse.json();
      console.log('Saved posts fetched successfully:', savedData.length, 'posts.');
      setSavedPosts(savedData);
    } catch (error) {
      console.error('Error fetching user data in UserProfile:', error);
      setPostsError(error.message || 'Failed to load your data.');
    } finally {
      setPostsLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    if (!user || !user._id) {
      console.error('User not authenticated');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/pet-posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete post');
      }

      fetchUserData();
    } catch (error) {
      console.error('Error deleting post:', error);
      setPostsError(error.message || 'Failed to delete post');
    }
  };

  const handleUnsavePost = async (postId) => {
    if (!user || !user._id) {
      console.error('User not authenticated');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/pet-posts/unsave/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to unsave post');
      }

      fetchUserData();
    } catch (error) {
      console.error('Error unsaving post:', error);
      setPostsError(error.message || 'Failed to unsave post');
    }
  };

  const handleEditPost = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  // This useEffect runs on component mount and when user or authLoading changes
  useEffect(() => {
    console.log('useEffect triggered:', { user, authLoading });
    const token = localStorage.getItem('token');
    if (!authLoading && token) {
      if (user && user._id) {
        console.log('User available, calling fetchUserData');
        fetchUserData();
      } else {
        console.log('Token exists but user not available, waiting for user state...');
        // If we have a token but no user, we're probably in the middle of a login
        // The user state will be set by the AuthContext useEffect
      }
    }
  }, [user, authLoading]);

  if (authLoading || postsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img src={PawLoading} alt="Loading..." className="w-32 h-32" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero/Banner Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16 text-center shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fadeInDown">
            Welcome, {user.username}!
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 animate-fadeInUp">
            Your personal space to manage your posts and saved stories.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* User Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Profile Details</h2>
          <p className="text-lg text-gray-700"><strong>Email:</strong> {user.email}</p>
          <p className="text-lg text-gray-700">
            <strong>Member Since:</strong> 
            {(() => {
              console.log('user.createdAt for Member Since:', user.createdAt);
              const createdAtDate = new Date(user.createdAt);
              return createdAtDate instanceof Date && !isNaN(createdAtDate) ? createdAtDate.toLocaleDateString() : 'Invalid Date';
            })()}
          </p>
        </div>

        {/* User's Posts Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Your Pet Stories</h2>
          {postsError && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200 text-center">
              {postsError}
            </div>
          )}
          {userPosts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
              <svg className="mx-auto h-20 w-20 text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Posts Yet!</h3>
              <p className="text-gray-600 mb-6">You haven't created any pet stories. Share your first one now!</p>
              <Link
                to="/create-post"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
              >
                Create New Post
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {userPosts.map(post => (
                <div key={post._id} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  {post.imageUrl && (
                    <img
                      src={`${API_URL}${post.imageUrl}`}
                      alt={post.title}
                      className="w-full h-56 object-cover object-center"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{post.title}</h3>
                      {user && user._id && post.author && post.author._id && post.author._id.toString() === user._id.toString() && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditPost(post._id)}
                            className="text-blue-500 hover:text-blue-700 p-2 rounded-full transition-colors duration-200 hover:bg-blue-100"
                            title="Edit Post"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-full transition-colors duration-200 hover:bg-red-100"
                            title="Delete Post"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                      {post.petType} - {post.breed}
                    </span>
                    <p className="text-gray-700 text-sm mt-4 line-clamp-3">{post.description}</p>
                    <div className="flex items-center text-gray-500 text-xs mt-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h.01M15 11h.01M12 15h.01M17 19H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z" />
                      </svg>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Saved Posts Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Saved Stories</h2>
          {savedPosts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
              <svg className="mx-auto h-20 w-20 text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Saved Stories Yet!</h3>
              <p className="text-gray-600 mb-6">Bookmark posts from the Pets tab to see them here.</p>
              <Link
                to="/pets"
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-purple-700 transition-colors duration-300 transform hover:scale-105"
              >
                Explore Pet Stories
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedPosts.map(post => (
                <div key={post._id} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  {post.imageUrl && (
                    <img
                      src={`${API_URL}${post.imageUrl}`}
                      alt={post.title}
                      className="w-full h-56 object-cover object-center"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{post.title}</h3>
                      <button
                        onClick={() => handleUnsavePost(post._id)}
                        className="text-yellow-500 hover:text-yellow-700 p-2 rounded-full transition-colors duration-200 hover:bg-yellow-100"
                        title="Unsave Post"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                      </button>
                    </div>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                      {post.petType} - {post.breed}
                    </span>
                    <p className="text-gray-700 text-sm mt-4 line-clamp-3">{post.description}</p>
                    <div className="flex items-center text-gray-500 text-xs mt-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h.01M15 11h.01M12 15h.01M17 19H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z" />
                      </svg>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserProfile; 