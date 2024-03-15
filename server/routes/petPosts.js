const express = require('express');
const router = express.Router();
const PetPost = require('../models/PetPost');
const fs = require('fs').promises;
const path = require('path');
const auth = require('../middleware/auth');
const multer = require('multer');
const User = require('../models/User');

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../public/uploads');
    fs.mkdir(uploadPath, { recursive: true }).then(() => cb(null, uploadPath)).catch(cb);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const { petType } = req.query;
    const query = petType && petType !== 'all' ? { petType } : {};
    
    console.log('Attempting to fetch posts with query:', query);

    const posts = await PetPost.find(query)
      .populate('author', 'username')
      .populate('comments.author', 'username')
      .sort({ createdAt: -1 });
    
    console.log('Successfully fetched posts.', posts.length, 'posts found.');
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts', details: error.message });
  }
});

// Get saved posts for the authenticated user
router.get('/saved', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'savedPosts',
      populate: [{
        path: 'author',
        select: 'username'
      }, {
        path: 'comments.author',
        select: 'username'
      }]
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.savedPosts);
  } catch (error) {
    console.error('Error fetching saved posts:', error);
    res.status(500).json({ message: 'Error fetching saved posts', details: error.message });
  }
});

// Get posts by a specific user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Optional: Add a check if the requesting user is the same as userId, or an admin
    // For now, any logged-in user can view another user's public posts.
    // If we want to restrict, we can add: if (req.user.id !== userId) return res.status(403).json({ message: 'Access denied' });

    const posts = await PetPost.find({ author: userId })
      .populate('author', 'username')
      .populate('comments.author', 'username')
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (error) {
    console.error('Error fetching user-specific posts:', error);
    res.status(500).json({ message: 'Error fetching user posts', details: error.message });
  }
});

// Get a single post by ID (This should be the LAST GET route to avoid conflicts)
router.get('/:postId', async (req, res) => {
  try {
    const post = await PetPost.findById(req.params.postId)
      .populate('author', 'username')
      .populate('comments.author', 'username');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching single post:', error);
    res.status(500).json({ message: 'Error fetching post', details: error.message });
  }
});

// Create a new post
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, petType, breed } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    
    // Basic validation
    if (!title || !description || !petType || !breed) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    // Removed strict breed validation as it's now handled by client-side dropdown and model enum for petType

    const post = new PetPost({
      title,
      description,
      petType,
      breed,
      imageUrl,
      author: req.user.id,
      likes: [],
      comments: []
    });

    await post.save();
    await post.populate('author', 'username');
    
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ 
      message: 'Error creating post',
      error: error.message 
    });
  }
});

// Like/Unlike a post
router.post('/:postId/like', auth, async (req, res) => {
  try {
    const post = await PetPost.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user.id);
    if (likeIndex === -1) {
      post.likes.push(req.user.id);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save({ validateBeforeSave: false });
    
    await post.populate('author', 'username');
    await post.populate('comments.author', 'username');

    res.json(post);
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Error liking post' });
  }
});

// Add a comment to a post
router.post('/:postId/comments', auth, async (req, res) => {
  try {
    const post = await PetPost.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      text: req.body.text,
      author: req.user.id
    };

    post.comments.push(comment);
    await post.save({ validateBeforeSave: false });
    
    await post.populate('comments.author', 'username');
    
    res.json(post);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment' });
  }
});

// Delete a post
router.delete('/:postId', auth, async (req, res) => {
  try {
    const post = await PetPost.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user is the author of the post
    if (post.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Delete the post's image if it exists
    if (post.imageUrl) {
      const imagePath = path.join(__dirname, '..', 'public', post.imageUrl);
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.error('Error deleting image file:', error);
      }
    }

    await PetPost.findByIdAndDelete(req.params.postId);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Error deleting post' });
  }
});

// Update a post
router.put('/:postId', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, petType, breed } = req.body;
    const { postId } = req.params;

    let post = await PetPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user is the author of the post
    if (post.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    // Handle image update
    if (req.file) {
      // Delete old image if it exists
      if (post.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', 'public', post.imageUrl);
        try {
          await fs.unlink(oldImagePath);
        } catch (error) {
          console.error('Error deleting old image file:', error);
          // Don't block the update if old image deletion fails
        }
      }
      post.imageUrl = `/uploads/${req.file.filename}`;
    }

    // Update post fields
    post.title = title || post.title;
    post.description = description || post.description;
    post.petType = petType || post.petType;
    post.breed = breed || post.breed;

    await post.save();
    await post.populate('author', 'username');
    await post.populate('comments.author', 'username');

    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
});

// Unsave a post
router.delete('/unsave/:postId', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const savedIndex = user.savedPosts.indexOf(postId);
    if (savedIndex > -1) {
      user.savedPosts.splice(savedIndex, 1);
      await user.save();
      res.json({ message: 'Post unsaved successfully' });
    } else {
      res.status(404).json({ message: 'Post not found in saved list' });
    }
  } catch (error) {
    console.error('Error unsaving post:', error);
    res.status(500).json({ message: 'Error unsaving post' });
  }
});

// Save/Unsave a post
router.post('/:postId/save', auth, async (req, res) => {
  try {
    const post = await PetPost.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const savedIndex = user.savedPosts.indexOf(post._id);
    if (savedIndex === -1) {
      user.savedPosts.push(post._id);
    } else {
      user.savedPosts.splice(savedIndex, 1);
    }

    await user.save();
    res.json({ saved: savedIndex === -1 });
  } catch (error) {
    console.error('Error saving/unsaving post:', error);
    res.status(500).json({ message: 'Error saving/unsaving post' });
  }
});

module.exports = router; 