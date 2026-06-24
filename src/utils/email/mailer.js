const nodemailer = require('nodemailer');

let transporterPromise = null;

const getTransporter = async () => {
  if (transporterPromise) return transporterPromise;

  transporterPromise = (async () => {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    if (!user || !pass) {
      throw new Error('EMAIL_USER/EMAIL_PASS ausentes no ambiente (verifique os segredos do Infisical para este serviço)');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });

    await transporter.verify(); // falha cedo se as credenciais/SMTP estiverem incorretas
    return { transporter, from: user };
  })();

  // Em caso de falha, limpa o cache para permitir nova tentativa no próximo envio.
  transporterPromise.catch(() => { transporterPromise = null; });
  return transporterPromise;
};

const sendMail = async ({ to, subject, html }) => {
  const { transporter, from } = await getTransporter();
  return transporter.sendMail({
    from: `"SchoolManager" <${from}>`,
    to,
    subject,
    html
  });
};

module.exports = { sendMail };
