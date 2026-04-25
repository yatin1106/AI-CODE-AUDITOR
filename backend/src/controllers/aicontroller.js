const { generateContent } = require('../services/aiservices');

const generate = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).send('No code provided');

    const result = await generateContent(code);

    // STOP using res.json(). Send the raw string directly.
    res.set('Content-Type', 'text/plain');
    return res.send(result); 

  } catch (error) {
    res.status(500).send('AI Error');
  }
};

module.exports = { generate };