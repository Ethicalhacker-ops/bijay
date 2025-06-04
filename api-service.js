// API Service
const API_BASE_URL = 'http://localhost:5000/api';

const apiService = {
    // Auth
    register: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        return await response.json();
    },

    login: async (credentials) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        return await response.json();
    },

    getUser: async (token) => {
        const response = await fetch(`${API_BASE_URL}/auth/user`, {
            headers: {
                'x-auth-token': token
            }
        });
        return await response.json();
    },

    // Resources
    getResources: async () => {
        const response = await fetch(`${API_BASE_URL}/resources`);
        return await response.json();
    },

    getResourcesByCategory: async (category) => {
        const response = await fetch(`${API_BASE_URL}/resources/${category}`);
        return await response.json();
    },

    // Videos
    getVideos: async () => {
        const response = await fetch(`${API_BASE_URL}/videos`);
        return await response.json();
    },

    // Tests
    getTests: async (token) => {
        const response = await fetch(`${API_BASE_URL}/tests`, {
            headers: {
                'x-auth-token': token
            }
        });
        return await response.json();
    },

    // Progress
    getProgress: async (token) => {
        const response = await fetch(`${API_BASE_URL}/progress`, {
            headers: {
                'x-auth-token': token
            }
        });
        return await response.json();
    },

    updateProgress: async (progressData, token) => {
        const response = await fetch(`${API_BASE_URL}/progress`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify(progressData)
        });
        return await response.json();
    }
};

// State management
let state = {
    isLoggedIn: false,
    token: null,
    user: null,
    progress: null
};

// DOM Elements
const mainContent = document.getElementById('mainContent');
const dashboardContent = document.getElementById('dashboardContent');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const authModal = document.getElementById('authModal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
const loginRequiredLinks = document.querySelectorAll('.login-required');
const userName = document.getElementById('userName');
const userProgress = document.getElementById('userProgress');

// Initialize the app
const init = async () => {
    // Check for token in localStorage
    const token = localStorage.getItem('ielts_token');
    if (token) {
        try {
            const { user, progress } = await apiService.getUser(token);
            state = {
                isLoggedIn: true,
                token,
                user,
                progress
            };
            updateUI();
        } catch (err) {
            console.error('Error validating token:', err);
            localStorage.removeItem('ielts_token');
        }
    }
};

// Update UI based on state
const updateUI = () => {
    if (state.isLoggedIn) {
        mainContent.style.display = 'none';
        dashboardContent.style.display = 'block';
        userName.textContent = state.user.name;
        userProgress.style.width = `${state.progress.progress}%`;
    } else {
        mainContent.style.display = 'block';
        dashboardContent.style.display = 'none';
    }
};

// Event Listeners

// Login Form Submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const { token } = await apiService.login({ email, password });
        const { user, progress } = await apiService.getUser(token);
        
        // Update state
        state = {
            isLoggedIn: true,
            token,
            user,
            progress
        };
        
        // Store token in localStorage
        localStorage.setItem('ielts_token', token);
        
        // Update UI
        updateUI();
        
        // Close modal
        authModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reset form
        loginForm.reset();
    } catch (err) {
        alert('Login failed. Please check your credentials.');
        console.error(err);
    }
});

// Signup Form Submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    try {
        const { token } = await apiService.register({ name, email, password });
        const { user, progress } = await apiService.getUser(token);
        
        // Update state
        state = {
            isLoggedIn: true,
            token,
            user,
            progress
        };
        
        // Store token in localStorage
        localStorage.setItem('ielts_token', token);
        
        // Update UI
        updateUI();
        
        // Close modal
        authModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reset form
        signupForm.reset();
        
        // Switch back to login tab for next time
        authTabs.forEach(tab => tab.classList.remove('active'));
        authForms.forEach(form => form.classList.remove('active'));
        document.querySelector('.auth-tab[data-tab="login"]').classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } catch (err) {
        alert('Registration failed. Please try again.');
        console.error(err);
    }
});

// User menu functionality
const userMenuBtn = document.getElementById('userMenuBtn');
userMenuBtn.addEventListener('click', () => {
    if (confirm('Would you like to logout?')) {
        // Logout
        state = {
            isLoggedIn: false,
            token: null,
            user: null,
            progress: null
        };
        localStorage.removeItem('ielts_token');
        updateUI();
    }
});

// Initialize the app
init();

// Load resources when page loads
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const resources = await apiService.getResources();
        // Populate resources in the UI
        // This would be more specific based on your actual UI structure
        console.log('Loaded resources:', resources);
    } catch (err) {
        console.error('Error loading resources:', err);
    }
});
