const mongoose = require('mongoose');

const connect = async () => {
    mongoUri = process.env.DATABASE_URL;
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

const close = async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        throw error;
    }
};

module.exports = {
    connect,
    close,
};