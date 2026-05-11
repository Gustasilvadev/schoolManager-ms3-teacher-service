const amqp = require('amqplib');

let connection = null;
let channel = null;

const connect = async () => {
  if (channel) return channel;

  connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();

  await channel.assertExchange(process.env.RABBITMQ_EXCHANGE, 'topic', { durable: true });
  await channel.assertExchange(process.env.RABBITMQ_DLQ_EXCHANGE, 'topic', { durable: true });

  connection.on('close', () => {
    console.error('[RabbitMQ] Conexão fechada');
    channel = null;
    connection = null;
  });
  connection.on('error', (err) => {
    console.error('[RabbitMQ] Erro de conexão:', err.message);
  });

  return channel;
};

const getChannel = () => channel;

module.exports = { connect, getChannel };
