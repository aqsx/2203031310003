const fetch = require('node-fetch');

const logger = async (req, res, next) => {
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body
  };

  try {
    // Log to console
    console.log(`${req.method} ${req.url} at ${logData.timestamp}`);

    // Send log to test server
    const response = await fetch('http://20.244.56.144/evaluation-service/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(logData)
    });

    if (!response.ok) {
      console.error('Failed to send log to test server:', await response.text());
    }
  } catch (error) {
    console.error('Error sending log to test server:', error);
  }

  next();
};

module.exports = logger; 