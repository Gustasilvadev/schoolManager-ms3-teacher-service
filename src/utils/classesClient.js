const { MESSAGES } = require('./constants');

const SERVICE_NAME = 'ClassesService';

const buildUrl = (path) => {
  const base = process.env.CLASSES_SERVICE_URL;
  if (!base) {
    throw new Error('CLASSES_SERVICE_URL não configurado');
  }
  return `${base.replace(/\/$/, '')}${path}`;
};

const fetchWithTimeout = async (url, authToken) => {
  const timeoutMs = parseInt(process.env.CLASSES_SERVICE_TIMEOUT_MS, 10) || 3000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: authToken ? { Authorization: authToken } : {}
    });
  } finally {
    clearTimeout(timer);
  }
};

const findDisciplineById = async (disciplineId, authToken) => {
  const url = buildUrl(`/disciplines/listDisciplineById/${encodeURIComponent(disciplineId)}`);
  let response;
  try {
    response = await fetchWithTimeout(url, authToken);
  } catch (err) {
    console.error(`[MS3->${SERVICE_NAME}] Falha ao consultar listDisciplineById:`, err.message);
    throw new Error(MESSAGES.EXTERNAL_SERVICE_UNAVAILABLE);
  }

  if (response.status === 404) return null;
  if (!response.ok) {
    console.error(`[MS3->${SERVICE_NAME}] listDisciplineById retornou HTTP ${response.status}`);
    throw new Error(MESSAGES.EXTERNAL_SERVICE_UNAVAILABLE);
  }
  return await response.json();
};

module.exports = { findDisciplineById };
