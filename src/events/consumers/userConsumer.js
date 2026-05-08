const teacherService = require('../../services/teacherService');
const { MESSAGES } = require('../../utils/constants');

const QUEUE_NAME = 'ms3.user.events';

const handleUserCreated = async (event) => {
  const { user_id, user_email, role, teacher_name, teacher_cpf } = event.payload || {};

  if (!teacher_name || !teacher_cpf) {
    console.log(`[MS3 consumer] UserCreated processado sem criação de professor (role=${role}, sem teacher_name/teacher_cpf) user_id=${user_id}`);
    return;
  }

  try {
    await teacherService.createTeacher({
      teacher_name,
      teacher_cpf,
      teacher_email: user_email,
      user_id
    });
    console.log(`[MS3 consumer] Teacher criado para user_id=${user_id} (role=${role})`);
  } catch (err) {
    if (err.message === MESSAGES.EMAIL_ALREADY_EXISTS || err.message === MESSAGES.CPF_ALREADY_EXISTS) {
      console.log(`[MS3 consumer] UserCreated idempotente (${err.message}) user_id=${user_id}`);
      return;
    }
    throw err;
  }
};

const handleUserDeleted = async (event) => {
  const { user_id } = event.payload || {};
  if (!user_id) {
    console.warn('[MS3 consumer] UserDeleted sem user_id no payload');
    return;
  }

  try {
    const teacher = await teacherService.getTeacherByUserId(user_id);
    await teacherService.deleteTeacher(teacher.teacher_id);
    console.log(`[MS3 consumer] Teacher soft-deleted para user_id=${user_id}`);
  } catch (err) {
    if (err.message === MESSAGES.TEACHER_NOT_FOUND) {
      console.log(`[MS3 consumer] UserDeleted idempotente (sem teacher vinculado) user_id=${user_id}`);
      return;
    }
    throw err;
  }
};

const startConsuming = async (channel) => {
  await channel.assertQueue(QUEUE_NAME, {
    durable: true,
    deadLetterExchange: process.env.RABBITMQ_DLQ_EXCHANGE
  });

  await channel.bindQueue(QUEUE_NAME, process.env.RABBITMQ_EXCHANGE, 'user.created');
  await channel.bindQueue(QUEUE_NAME, process.env.RABBITMQ_EXCHANGE, 'user.deleted');

  await channel.consume(QUEUE_NAME, async (msg) => {
    if (!msg) return;
    console.log("MENSAGEM RECEBIDA:", msg.content.toString());
    let event;
    try {
      event = JSON.parse(msg.content.toString());
    } catch (parseErr) {
      console.error('[MS3 consumer] Mensagem inválida (JSON parse falhou)');
      channel.nack(msg, false, false);
      return;
    }

    try {
      if (event.event_type === 'UserCreated') {
        await handleUserCreated(event);
      } else if (event.event_type === 'UserDeleted') {
        await handleUserDeleted(event);
      } else {
        console.warn(`[MS3 consumer] Evento desconhecido: ${event.event_type}`);
      }
      channel.ack(msg);
    } catch (err) {
      console.error(`[MS3 consumer] Falha ao processar ${event?.event_type}:`, err.message);
      channel.nack(msg, false, false);
    }
  });
};

module.exports = { startConsuming, handleUserCreated, handleUserDeleted };
