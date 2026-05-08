const express = require('express');
const teacherRoutes = require('./teacherRoutes');

const router = express.Router();

router.use('/teachers', teacherRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'teacher-service' });
});

module.exports = router;