const express = require('express');
const logger = require('./logger');
const { nanoid } = require('nanoid');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(logger);
app.use(express.json());

const urlDatabase = {}; // { code: { url, expiresAt } }

app.post('/shorten', (req, res) => {
  const { url, validityMins } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const code = nanoid(6);
  const now = Date.now();
  const validity = validityMins ? parseInt(validityMins, 10) : 30; // default 30 mins
  const expiresAt = now + validity * 60 * 1000;

  urlDatabase[code] = { url, expiresAt };
  res.json({ 
    shortUrl: `http://localhost:${PORT}/${code}`, 
    expiresAt,
    validityMins: validity 
  });
});

app.get('/:code', (req, res) => {
  const { code } = req.params;
  const entry = urlDatabase[code];
  if (entry) {
    if (Date.now() < entry.expiresAt) {
      return res.redirect(entry.url);
    } else {
      delete urlDatabase[code]; // Clean up expired URLs
      return res.status(410).send('This short URL has expired.');
    }
  }
  res.status(404).send('URL not found');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 