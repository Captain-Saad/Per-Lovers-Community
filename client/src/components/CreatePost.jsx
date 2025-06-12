// Temporary comment to force re-compilation
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const API_URL = 'http://localhost:5000';

const CreatePost = () => {
  const { postId } = useParams(); // Get postId from URL
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    petType: '',
    breed: '',
    image: null,
    currentImageUrl: '' // To display existing image when editing
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const dogBreeds = [
    'Labrador Retriever', 'German Shepherd', 'Golden Retriever', 'French Bulldog',
    'Bulldog', 'Poodle', 'Beagle', 'Rottweiler', 'Dachshund', 'Yorkshire Terrier',
    'Boxer', 'Chihuahua', 'Great Dane', 'Doberman', 'Shih Tzu', 'Other'
  ];

  const catBreeds = [
    'Persian', 'Maine Coon', 'Siamese', 'Ragdoll', 'Bengal', 'Abyssinian',
    'British Shorthair', 'Sphynx', 'Birman', 'Russian Blue', 'Other'
  ];

  const birdBreeds = [
    'Parrot', 'Cockatiel', 'Budgerigar', 'Canary', 'Finch', 'Lovebird', 'Other'
  ];

  // New useEffect to fetch post data if editing
  useEffect(() => {
    if (postId) {
      const fetchPostData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${API_URL}/api/pet-posts/${postId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch post for editing');
          }
          const data = await response.json();
          setFormData({
            title: data.title,
            description: data.description,
            petType: data.petType,
            breed: data.breed,
            image: null, // Image input should be empty for new upload
            currentImageUrl: data.imageUrl || ''
          });
          setError('');
        } catch (err) {
          setError(err.message || 'Error loading post data.');
        } finally {
          setLoading(false);
        }
      };
      fetchPostData();
    } else {
      // Reset form if navigating from edit to create new post
      setFormData({
        title: '',
        description: '',
        petType: '',
        breed: '',
        image: null,
        currentImageUrl: ''
      });
    }
  }, [postId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'petType') {
      setFormData({
        ...formData,
        [name]: value,
        breed: '' // Reset breed when pet type changes
      });
    } else {
      setFormData({
        ...formData,
        [name]: files ? files[0] : value
      });
    }
  };

  const handleFileChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFormData({
        ...formData,
        image: file
      });
      setError('');
    } else {
      setFormData({
        ...formData,
        image: null
      });
      setError('Please select a valid image file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!user) {
      setError('You must be logged in to create or edit a post');
      setLoading(false);
      return;
    }

    if (!formData.image && !formData.currentImageUrl && !postId) {
      setError('Please select an image to upload.');
      setLoading(false);
      return;
    }

    if (!formData.petType || !formData.breed) {
      setError('Please select both pet type and breed.');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('petType', formData.petType);
      formDataToSend.append('breed', formData.breed);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const method = postId ? 'PUT' : 'POST';
      const url = postId ? `${API_URL}/api/pet-posts/${postId}` : `${API_URL}/api/pet-posts`;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || (postId ? 'Failed to update post' : 'Failed to create post'));
      }

      navigate('/pets');
    } catch (error) {
      setError(error.message || (postId ? 'Failed to update post' : 'Failed to create post'));
    } finally {
      setLoading(false);
    }
  };

  const renderBreedOptions = () => {
    switch (formData.petType) {
      case 'Dog':
        return dogBreeds.map(breed => (
          <option key={breed} value={breed}>{breed}</option>
        ));
      case 'Cat':
        return catBreeds.map(breed => (
          <option key={breed} value={breed}>{breed}</option>
        ));
      case 'Bird':
        return birdBreeds.map(breed => (
          <option key={breed} value={breed}>{breed}</option>
        ));
      case 'Other':
        return <option value="Other">Other</option>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero/Banner Section */}
      <section className="bg-gradient-to-r from-teal-500 to-green-600 text-white py-16 text-center shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fadeInDown">
            {postId ? 'Edit Your Pet Story' : 'Share Your Pet\'s Story!'}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 animate-fadeInUp">
            {postId ? 'Make changes to your existing pet story.' : 'Create a new post to share heartwarming moments, adorable photos, and connect with fellow pet lovers.'}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            {postId ? 'Edit Post' : 'Create New Post'}
          </h2>
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-base font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="A catchy title for your post..."
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-base font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Tell us all about your pet and their story..."
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="petType" className="block text-base font-medium text-gray-700 mb-2">
                  Pet Type
                </label>
                <select
                  id="petType"
                  name="petType"
                  value={formData.petType}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                >
                  <option value="">Select pet type</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {formData.petType && (
                <div>
                  <label htmlFor="breed" className="block text-base font-medium text-gray-700 mb-2">
                    Breed
                  </label>
                  <select
                    id="breed"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                  >
                    <option value="">Select a breed</option>
                    {renderBreedOptions()}
                  </select>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="image" className="block text-base font-medium text-gray-700 mb-2">
                Image Upload
              </label>
              {formData.currentImageUrl && postId && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                  <img src={`${API_URL}${formData.currentImageUrl}`} alt="Current Post" className="max-w-xs h-32 object-cover rounded-lg shadow-md" />
                  <p className="text-xs text-gray-500 mt-1">Upload a new image to replace the current one.</p>
                </div>
              )}
              <div
                className={`mt-1 flex justify-center items-center w-full px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L40 32" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="image" type="file" className="sr-only" onChange={(e) => handleFileChange(e.target.files[0])} accept="image/*" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? 'Processing...' : (postId ? 'Update Post' : 'Create Post')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost; 