import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero/Banner Section */}
      <section className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-16 text-center shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fadeInDown">About Our Community</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 animate-fadeInUp">
            Connecting pet lovers worldwide, one story at a time.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-12">
          <div className="bg-white p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our mission is to foster a supportive and engaging environment for all pet owners and lovers. Whether you have a dog, cat, bird, or any other wonderful creature, this community is for you! We are dedicated to creating a vibrant space where pet enthusiasts can connect, share, and celebrate their beloved animal companions.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m-5 4v-4m-1.293-7.293l2.828 2.829m-2.828-2.829A7.949 7.949 0 0112 4.004c1.69 0 3.321.43 4.793 1.258m-4.793-1.258V2m8.88 12.337l-2.828 2.829m2.828-2.829A7.949 7.949 0 0012 19.996c-1.69 0-3.321-.43-4.793-1.258m4.793 1.258V22M6 18H2v-4a2 2 0 012-2h2m0 0l2.121-2.121M2 14v4m0-4a2 2 0 012-2h2m0 0a2 2 0 012-2h2m0 0l2.121-2.121M6 18H2v-4a2 2 0 012-2h2m0 0a2 2 0 012-2h2m0 0l2.121-2.121M6 18H2v-4a2 2 0 012-2h2m0 0a2 2 0 012-2h2m0 0l2.121-2.121M6 18H2v-4a2 2 0 012-2h2m0 0a2 2 0 012-2h2m0 0l2.121-2.121" />
              </svg>
              Our Vision
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We envision a world where every pet is cherished and every pet lover feels connected. Our platform aims to be the go-to place for sharing heartwarming stories, posting adorable photos, asking questions, getting advice, and interacting with fellow pet lovers from around the globe.
            </p>
          </div>
        </div>

        <div className="text-center bg-white p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Join Our Community!</h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Be a part of our growing family of pet enthusiasts. Share your unique pet story, connect with like-minded individuals, and celebrate the incredible bond we share with our animals.
          </p>
          <a 
            href="/register" 
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full shadow-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
          >
            Get Started Today
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 