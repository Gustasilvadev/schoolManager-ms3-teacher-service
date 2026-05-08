require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');
const { connect: connectRabbit } = require('./events/connection');
const { startConsuming } = require('./events/consumers/userConsumer');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', routes);

app.use(errorHandler);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`TeacherService rodando na porta ${PORT}`);
  console.log(`Documentação Swagger: http://localhost:${PORT}/api-docs`);
});

connectRabbit()
  .then(async (channel) => {
    await startConsuming(channel);
    console.log('[MS3] RabbitMQ consumer iniciado');
  })
  .catch((err) => console.error('[MS3] Falha ao conectar RabbitMQ:', err.message));