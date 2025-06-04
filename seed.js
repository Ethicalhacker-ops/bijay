const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Resource = require('./models/Resource');
const Video = require('./models/Video');
const Test = require('./models/Test');
const UserProgress = require('./models/UserProgress');

// Connect to DB
mongoose.connect('mongodb://localhost:27017/ieltsmaster', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Sample data
const seedUsers = [
    {
        name: 'Admin User',
        email: 'admin@ieltsmaster.com',
        password: 'password123'
    },
    {
        name: 'Test Student',
        email: 'student@ieltsmaster.com',
        password: 'password123'
    }
];

const seedResources = [
    {
        title: 'Cambridge IELTS 1-19 Full Collection',
        description: 'Complete set of all Cambridge IELTS books with PDF and audio files',
        category: 'cambridge',
        fileType: 'PDF + Audio',
        fileSize: '850MB',
        downloadLink: '/uploads/cambridge-ielts-full.zip'
    },
    {
        title: 'Cambridge IELTS 16 Academic',
        description: 'Official Cambridge IELTS Academic preparation book with answers',
        category: 'cambridge',
        fileType: 'PDF',
        fileSize: '25MB',
        downloadLink: '/uploads/cambridge-ielts-16.pdf'
    },
    // Add more resources...
];

const seedVideos = [
    {
        title: 'Listening Section Masterclass',
        description: 'Learn proven strategies to improve your listening score with our band 9 instructor.',
        instructor: 'Sarah Johnson',
        duration: '24:35',
        thumbnail: '/images/listening-thumbnail.jpg',
        videoUrl: 'https://www.youtube.com/embed/5rC7gB_y5s4',
        category: 'listening'
    },
    {
        title: 'Writing Task 2: Opinion Essays',
        description: 'Step-by-step guide to writing high-scoring opinion essays for IELTS Writing Task 2.',
        instructor: 'Michael Chen',
        duration: '32:15',
        thumbnail: '/images/writing-thumbnail.jpg',
        videoUrl: 'https://www.youtube.com/embed/9Po8MgZbF2U',
        category: 'writing'
    },
    // Add more videos...
];

const seedTests = [
    {
        title: 'IELTS Practice Test 1',
        description: 'Full-length IELTS practice test with all sections',
        level: 'medium',
        duration: 180,
        sections: {
            listening: true,
            reading: true,
            writing: true,
            speaking: true
        },
        fileUrl: '/uploads/test1.pdf',
        answerKey: '/uploads/test1-answers.pdf'
    },
    // Add more tests...
];

// Seed function
const seedDB = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Resource.deleteMany({});
        await Video.deleteMany({});
        await Test.deleteMany({});
        await UserProgress.deleteMany({});

        // Hash passwords and create users
        for (let user of seedUsers) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            await User.create(user);
        }

        // Create resources
        await Resource.insertMany(seedResources);

        // Create videos
        await Video.insertMany(seedVideos);

        // Create tests
        await Test.insertMany(seedTests);

        // Create progress for test student
        const student = await User.findOne({ email: 'student@ieltsmaster.com' });
        if (student) {
            await UserProgress.create({
                userId: student._id,
                targetBand: 7.5,
                currentBand: 6.0,
                progress: 45
            });
        }

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
