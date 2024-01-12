// app.js
'use strict';

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();
const connectDB = require('./config/database');
const profileRoutes = require('./routes/profile');
const userRoutes = require('./routes/user');
const commentRoutes = require('./routes/comment');

app.use(express.json());

// Connect to local MongoDB
connectDB.connect();

// set the view engine to ejs
app.set('view engine', 'ejs');

// routes
app.use('/', profileRoutes());
app.use('/', userRoutes());
app.use('/', commentRoutes());



// start server
const server = app.listen(port, () => {
  console.log('Express started. Listening on port', port);
});

// Handle termination signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

async function gracefulShutdown() {
  try {
    console.log('Received termination signal. Closing server and MongoDB connection...');

    // Close the Express server
    await server.close();

    // Close the MongoDB connection
    await connectDB.close();

    console.log('Server and MongoDB connection closed.');
    process.exit(0); 
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
}