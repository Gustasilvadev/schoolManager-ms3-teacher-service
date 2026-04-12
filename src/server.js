require('dotenv').config();
const express = require('express');
const prisma = require('./config/prisma');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => res.status(200).json({ status: 'OK', service: 'teacher-service' }));

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`TeacherService rodando na porta ${PORT}`);
});