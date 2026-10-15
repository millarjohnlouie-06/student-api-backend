// api/index.js
const connectToDatabase = require('../db');
const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    content: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

const Record = mongoose.models.Record || mongoose.model('Record', RecordSchema);

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const records = await Record.find({}).sort({ createdAt: -1 }).limit(100);
      return res.status(200).json(records);
    }

    if (req.method === 'POST') {
      const { title, content } = req.body || {};
      const newRecord = await Record.create({ title, content });
      return res.status(201).json(newRecord);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Title and content are required (max 100 and 1000 characters).',
      });
    }
    console.error(error);
    return res.status(500).json({ error: 'Database connection failed' });
  }
};