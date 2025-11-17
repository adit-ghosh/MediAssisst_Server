const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const routes = require('./routes');
const cors = require('cors');
const setupSwagger = require('./config/swagger');

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());

setupSwagger(app); 

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

module.exports = app;