const express = require('express');
const cors = require('cors'); // 1. Import cors
const aiRoutes = require('./routes/airoutes');
const app = express();

// 2. Enable CORS for all origins
// This allows your frontend (on port 5173, 3001, etc.) to talk to this server
app.use(cors()); 

app.use(express.json()); 

app.get('/', (req, res) => {
  res.send("hello world");
});

app.use('/api/ai', aiRoutes); 

module.exports = app;