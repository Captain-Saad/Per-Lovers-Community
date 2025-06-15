import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000';

const FeaturedStories = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPost, setExpandedPost] = useState(null);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        console.log('Fetching featured stories...');
        const response = await fetch(`${API_URL}/api/pet-posts`); // Fetch all posts
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Received data for featured stories:', data);
        setFeaturedPosts(data.slice(0, 3)); // Take the first 3 as featured
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured stories:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

  const handleReadMore = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Featured Stories</h2>
      {loading ? (
        <div className="text-center text-gray-600">Loading featured stories...</div>
      ) : error ? (
        <div className="text-red-500 text-center">Error: {error}</div>
      ) : featuredPosts.length === 0 ? (
        <div className="text-center text-gray-500">No featured stories found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPosts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {post.imageUrl && (
                <img
                  src={`${API_URL}${post.imageUrl}`}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Posted by <span className="font-medium text-blue-600">{post.author?.username || 'Anonymous'}</span>
                </p>
                <p className="text-gray-600 mb-4">
                  {expandedPost === post._id 
                    ? post.description 
                    : post.description && post.description.length > 100 
                      ? `${post.description.substring(0, 100)}...` 
                      : post.description}
                </p>
                <Link
                  to={`/pets?postId=${post._id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedStories; 