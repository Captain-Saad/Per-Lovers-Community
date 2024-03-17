import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PawLoading from '../assets/paw_loading.gif';

const API_URL = 'http://localhost:5000';

const Pets = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [selectedPetType, setSelectedPetType] = useState('all');
  const [expandedPost, setExpandedPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);
  const location = useLocation();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = selectedPetType === 'all' 
        ? `${API_URL}/api/pet-posts`
        : `${API_URL}/api/pet-posts?petType=${selectedPetType}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch posts');
      }
      
      const data = await response.json();
      setPosts(data);

      // Check for postId in URL and expand if present
      const queryParams = new URLSearchParams(location.search);
      const postIdFromUrl = queryParams.get('postId');
      if (postIdFromUrl) {
        setExpandedPost(postIdFromUrl);
      } else {
        setExpandedPost(null); // Ensure it's reset if no ID is present
      }

    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error.message || 'Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedPetType, location.search, user]);

  // New useEffect to log expandedPost changes
  useEffect(() => {
    console.log('expandedPost state changed to:', expandedPost);
  }, [expandedPost]);

  const handleLikePost = async (postId) => {
    if (!user) {
      setError('Please log in to like posts');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/pet-posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to like post');
      }
      
      const updatedPost = await response.json();
      setPosts(posts.map(post => 
        post._id === postId ? updatedPost : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
      setError('Failed to like post. Please try again.');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

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
      
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post. Please try again.');
    }
  };

  const handleReadMore = (postId) => {
    console.log('Toggling expandedPost from', expandedPost, 'to', postId);
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const handleAddComment = async (postId) => {
    if (!user) {
      setError('Please log in to add comments');
      return;
    }

    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/pet-posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ text: newComment })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add comment');
      }
      
      const updatedPost = await response.json();
      setPosts(posts.map(post => 
        post._id === postId ? updatedPost : post
      ));
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment. Please try again.');
    }
  };

  const handleSavePost = async (postId) => {
    if (!user) {
      setError('Please log in to save posts');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/pet-posts/${postId}/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save post');
      }
      
      const { saved } = await response.json();
      setSavedPosts(prev => 
        saved 
          ? [...prev, postId]
          : prev.filter(id => id !== postId)
      );
    } catch (error) {
      console.error('Error saving post:', error);
      setError('Failed to save post. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img src={PawLoading} alt="Loading..." className="w-32 h-32" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
        <h2 className="text-4xl font-extrabold text-red-600 mb-4">Oops!</h2>
        <p className="text-xl text-gray-700 mb-6">Something went wrong while fetching pet posts.</p>
        <div className="text-red-500 text-center bg-red-100 p-4 rounded-lg shadow-md">
          <p className="text-lg font-semibold mb-2">Error Details:</p>
          <p>{error}</p>
        </div>
        <button 
          onClick={() => setError(null)}
          className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero/Banner Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16 text-center shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fadeInDown">Discover Our Wonderful Pets!</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 animate-fadeInUp">
            Browse heartwarming stories, adorable photos, and connect with fellow pet enthusiasts. Your next furry friend's story awaits!
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Filter Pet Stories</h2>
          <select
            value={selectedPetType}
            onChange={(e) => setSelectedPetType(e.target.value)}
            className="w-full md:w-64 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          >
            <option value="all">All Types</option>
            <option value="Dog">Dogs</option>
            <option value="Cat">Cats</option>
            <option value="Bird">Birds</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-md max-w-2xl mx-auto mt-10">
            <svg className="mx-auto h-20 w-20 text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Pet Stories Found</h3>
            <p className="text-gray-600 mb-6">It looks like there aren't any posts yet for this type. Why not share your own?</p>
            <Link
              to="/create-post"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
            >
              Create Your First Post!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <div key={post._id} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                {post.imageUrl && (
                  <img
                    src={`http://localhost:5000${post.imageUrl}`}
                    alt={post.title}
                    className="w-full h-56 object-cover object-center"
                  />
                )}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{post.title}</h3>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                      {post.petType} - {post.breed}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{post.description}</p>
                  
                  <div className="flex items-center text-gray-500 text-xs mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h.01M15 11h.01M12 15h.01M17 19H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z" />
                    </svg>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleLikePost(post._id)}
                        className={`flex items-center space-x-1 p-2 rounded-full transition-colors duration-200 ${user && post.likes?.includes(user._id) ? 'text-red-500 bg-red-100' : 'text-gray-500 hover:text-red-500 hover:bg-gray-100'}`}
                        disabled={!user}
                        title="Like Post"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <span>{post.likes?.length || 0}</span>
                      </button>
                      <button
                        onClick={() => handleReadMore(post._id)}
                        className={`flex items-center space-x-1 p-2 rounded-full transition-colors duration-200 ${expandedPost === post._id ? 'text-blue-500 bg-blue-100' : 'text-gray-500 hover:text-blue-500 hover:bg-gray-100'}`}
                        title="View Comments"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                        <span>{post.comments?.length || 0}</span>
                      </button>
                      <button
                        onClick={() => handleSavePost(post._id)}
                        className={`flex items-center space-x-1 p-2 rounded-full transition-colors duration-200 ${savedPosts.includes(post._id) ? 'text-yellow-500 bg-yellow-100' : 'text-gray-500 hover:text-yellow-500 hover:bg-gray-100'}`}
                        disabled={!user}
                        title="Save Post"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                      </button>
                    </div>
                    {(console.log('Delete button condition check:', { user, postAuthor: post.author, userId: user?._id, postAuthorId: post.author?._id }),
                    user && user._id && post.author && post.author._id && post.author._id.toString() === user._id.toString()) && (
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full transition-colors duration-200 ml-auto hover:bg-red-100"
                        title="Delete Post"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {expandedPost === post._id && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">Comments</h4>
                      {post.comments && post.comments.length > 0 ? (
                        <div className="space-y-3">
                          {post.comments.map((comment, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-gray-700 text-sm">{comment.text}</p>
                              <p className="text-gray-500 text-xs mt-1">By {comment.author?.username || 'Unknown'} on {new Date(comment.createdAt).toLocaleDateString()}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No comments yet. Be the first to share your thoughts!</p>
                      )}
                      {user && (
                        <div className="mt-4 flex items-center space-x-3">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                          />
                          <button
                            onClick={() => handleAddComment(post._id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                          >
                            Add Comment
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pets;