const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Database connection
mongoose.connect('mongodb://localhost:27017/ieltsmaster', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Models
const User = require('./models/User');
const Resource = require('./models/Resource');
const Video = require('./models/Video');
const Test = require('./models/Test');
const UserProgress = require('./models/UserProgress');

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Authentication middleware
const authenticate = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Routes

// User registration
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = new User({
            name,
            email,
            password
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Create user progress
        const userProgress = new UserProgress({
            userId: user._id,
            targetBand: 7.5,
            currentBand: 5.0,
            progress: 0
        });
        await userProgress.save();

        // Create and return JWT
        const payload = {
            user: {
                id: user._id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// User login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create and return JWT
        const payload = {
            user: {
                id: user._id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get user data
app.get('/api/auth/user', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const userProgress = await UserProgress.findOne({ userId: req.user.id });
        
        res.json({
            user,
            progress: userProgress
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Resources routes
app.get('/api/resources', async (req, res) => {
    try {
        const resources = await Resource.find().sort({ category: 1, title: 1 });
        res.json(resources);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.get('/api/resources/:category', async (req, res) => {
    try {
        const resources = await Resource.find({ category: req.params.category });
        res.json(resources);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Video routes
app.get('/api/videos', async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 });
        res.json(videos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Test routes
app.get('/api/tests', authenticate, async (req, res) => {
    try {
        const tests = await Test.find().sort({ level: 1 });
        res.json(tests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// User progress routes
app.get('/api/progress', authenticate, async (req, res) => {
    try {
        const progress = await UserProgress.findOne({ userId: req.user.id });
        res.json(progress);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.put('/api/progress', authenticate, async (req, res) => {
    try {
        const { currentBand, targetBand } = req.body;
        
        let progress = await UserProgress.findOne({ userId: req.user.id });
        if (!progress) {
            progress = new UserProgress({
                userId: req.user.id,
                targetBand,
                currentBand,
                progress: Math.min((currentBand / targetBand) * 100, 100)
            });
        } else {
            progress.targetBand = targetBand;
            progress.currentBand = currentBand;
            progress.progress = Math.min((currentBand / targetBand) * 100, 100);
        }
        
        await progress.save();
        res.json(progress);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
