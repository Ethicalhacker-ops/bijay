# Clone the repository (if using Git)
git clone https://github.com/yourusername/ielts-master.git
cd ielts-master

# Install dependencies
npm install express mongoose bcryptjs jsonwebtoken cors multer body-parser
npm install -D nodemon (for development)

# Seed the database (optional)
node seed.js

# Start the server
node server.js
