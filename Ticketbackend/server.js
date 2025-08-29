require('dotenv').config();
require('./cron/ticketAllocator'); 
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./configs/dbConfig');
const authRoutes = require('./routes/userRoute');
const ticketRoutes = require('./routes/ticketRoutes');
const replyRoutes= require('./routes/replyRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// // Connect to Database
// connectDB();

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Routes
app.use('/api/v1', authRoutes);
app.use('/api/v2', ticketRoutes,replyRoutes);




// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});