# Pet Lovers Community

A full-stack web application that connects pet lovers, allowing them to share stories, photos, and experiences about their beloved pets.

## Features

- **User Authentication**
  - Secure login and registration system
  - User profile management
  - Protected routes for authenticated users

- **Pet Stories**
  - Create and share pet stories with photos
  - Filter stories by pet type (Dogs, Cats, Birds, Others)
  - Like and comment on stories
  - Save favorite stories
  - Responsive design for all devices

- **Interactive Features**
  - Real-time like and comment system
  - Save posts for later viewing
  - User profile with saved posts
  - Responsive navigation with mobile menu

- **Modern UI/UX**
  - Clean and intuitive interface
  - Responsive design for all screen sizes
  - Loading animations and error handling
  - Beautiful gradients and transitions

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Tailwind CSS for styling
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd pet-lovers-community
```

2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables
Create a `.env` file in the server directory with the following variables:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the application
```bash
# Start the server (from server directory)
npm start

# Start the client (from client directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Project Structure

```
pet-lovers-community/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Context providers
│   │   ├── assets/        # Static assets
│   │   └── App.jsx        # Main application component
│   └── package.json
│
└── server/                # Backend Express application
    ├── models/           # Mongoose models
    ├── routes/           # API routes
    ├── middleware/       # Custom middleware
    └── server.js         # Server entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Captain-Saad - bsai23011@itu.edu.pk

Project Link: [https://github.com/Captain-Saad/Pet-Lovers-Community](https://github.com/Captain-Saad/Pet-Lovers-Community) 