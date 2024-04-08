const dotenv = require('dotenv');
dotenv.config();

const config = {
    hostname:process.env.HOST || 'localhost',
    port:process.env.PORT || "5000",
    mongoDbUri:process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/StudentManagementSystem',
}

module.exports = config