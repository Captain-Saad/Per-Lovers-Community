import React from 'react';

const commonBreeds = [
  'Labrador Retriever',
  'German Shepherd',
  'Golden Retriever',
  'French Bulldog',
  'Bulldog',
  'Poodle',
  'Beagle',
  'Rottweiler',
  'Dachshund',
  'Yorkshire Terrier',
  'Persian',
  'Maine Coon',
  'Siamese',
  'Ragdoll',
  'British Shorthair',
  'Sphynx',
  'Abyssinian',
  'Bengal',
  'Russian Blue',
  'American Shorthair'
];

function BreedFilter({ selectedBreed, onBreedChange }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Filter by Breed</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onBreedChange('')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            selectedBreed === ''
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Breeds
        </button>
        {commonBreeds.map((breed) => (
          <button
            key={breed}
            onClick={() => onBreedChange(breed)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              selectedBreed === breed
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {breed}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Search for a specific breed..."
          value={selectedBreed}
          onChange={(e) => onBreedChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}

export default BreedFilter; 