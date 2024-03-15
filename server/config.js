require('dotenv').config();

const config = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://saadkhaan124:<db_password>@petlovers.rt6kajd.mongodb.net/pet-lovers?retryWrites=true&w=majority&appName=PetLovers',
  JWT_SECRET: process.env.JWT_SECRET || 'pet_lovers_jwt_secret_2024'
};

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Using default values. This is not recommended for production.');
}

console.log('Using configuration:', {
  PORT: config.PORT,
  MONGODB_URI: '***set***',
  JWT_SECRET: '***set***'
});

module.exports = config; 