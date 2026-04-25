const express = require('express');
const router = express.Router();
const { generate } = require('../controllers/aicontroller');

router.post('/generate', generate);

module.exports = router;