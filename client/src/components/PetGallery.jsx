import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PawLoading from '../assets/paw_loading.gif';

function PetGallery({ selectedBreed }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, [selectedBreed]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const url = selectedBreed 
        ? `http://localhost:5000/api/pet-posts/breed/${encodeURIComponent(selectedBreed)}`
        : 'http://localhost:5000/api/pet-posts';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/pet-posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 'current-user-id' }), // Replace with actual user ID
      });
      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }
      fetchPosts(); // Refresh posts to update like status
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-12">
            <img src={PawLoading} alt="Loading..." className="w-32 h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <img
                src={`http://localhost:5000${post.imageUrl}`}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{post.title}</h2>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                    {post.breed}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span>{post.likes.length} likes</span>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleLike(post._id)}
                    className="flex items-center text-indigo-600 hover:text-indigo-800"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Like
                  </button>
                  <Link
                    to={`/post/${post._id}`}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-lg p-8 max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Posts Found</h3>
              <p className="text-gray-600">Be the first to share your pet's story!</p>
              <Link
                to="/create-post"
                className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                Create Post
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PetGallery; 