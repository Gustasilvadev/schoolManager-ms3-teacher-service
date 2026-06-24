const { sendMail } = require('./mailer');
const { teacherWelcomeTemplate } = require('./templates/teacherWelcome');

const sendTeacherWelcomeEmail = async ({ to, teacherName }) => {
  const base = (process.env.FRONTEND_BASE_URL || 'http://academico3.rj.senac.br/20261prj5/schoolmanagement').replace(/\/$/, '');
  const loginUrl = `${base}/login`;
  const html = teacherWelcomeTemplate({ teacherName, loginUrl });
  return sendMail({ to, subject: 'Bem-vindo(a) ao SchoolManager', html });
};

module.exports = { sendTeacherWelcomeEmail };
