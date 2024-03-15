import React from 'react';
import Hero from './Hero';
import FeaturedStories from './FeaturedStories';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Featured Stories Section */}
      <FeaturedStories />
      
      {/* Contact Us Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-4">
          <div className="w-full">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Contact Us</h2>
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Email Us</h3>
                      <a href="mailto:saadkhaan124@gmail.com" className="text-blue-600 hover:text-blue-800 transition-colors">
                        saadkhaan124@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Response Time</h3>
                      <p className="text-gray-600">Within 24 hours</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Get in Touch</h3>
                  <p className="text-gray-600 mb-4">
                    Have questions about our pet community? We'd love to hear from you! 
                    Send us an email and we'll respond as soon as possible.
                  </p>
                  <div className="flex justify-center">
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=saadkhaan124@gmail.com" 
                       className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                       target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Send Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 