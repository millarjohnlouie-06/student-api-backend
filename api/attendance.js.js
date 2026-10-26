const connectToDatabase = require('../db');
const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  studentId: String,
  studentName: String,
  subjectName: String,
  section: String,
  attendance: Array
}, { strict: false });

const Attendance = mongoose.models.daily_attendance || mongoose.model('daily_attendance', AttendanceSchema, 'daily_attendance');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const records = await Attendance.find({});
      return res.status(200).json(records);
    }

    if (req.method === 'POST') {
      // Ensure body is parsed correctly
      const requestData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const newRecord = await Attendance.create(requestData);
      return res.status(201).json(newRecord);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};