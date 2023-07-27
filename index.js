const serverless = require('serverless-http');
const express = require('express');
const { generatePdf } = require('./generatePdf');

const app = express();

app.get('/', (req, res, next) => {
  return res.status(200).json({
    message: 'Hello from root!',
  });
});

app.get('/path', (req, res, next) => {
  return res.status(200).json({
    message: 'Hello from path!',
  });
});

app.get('/pdf', async (req, res, next) => {
  const pdf = await generatePdf();
  return res.status(200).json({
    statusCode: 200,
    headers: {
      'Content-Type': 'application/pdf',
    },
    body: pdf.toString('base64'),
    isBase64Encoded: true,
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: 'Not Found',
  });
});

module.exports.handler = serverless(app);
