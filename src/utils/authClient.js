const { MESSAGES } = require('./constants');

const SERVICE_NAME = 'AuthService';

const buildUrl = (path) => {
  const base = process.env.AUTH_SERVICE_URL;
  if (!base) {
    throw new Error('AUTH_SERVICE_URL não configurado');
  }
  return `${base.replace(/\/$/, '')}${path}`;
};

const fetchWithTimeout = async (url, authToken) => {
  const timeoutMs = parseInt(process.env.AUTH_SERVICE_TIMEOUT_MS, 10) || 3000;
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

const findUserById = async (userId, authToken) => {
  const url = buildUrl(`/users/listUserById/${encodeURIComponent(userId)}`);
  let response;
  try {
    response = await fetchWithTimeout(url, authToken);
  } catch (err) {
    console.error(`[MS3->${SERVICE_NAME}] Falha ao consultar listUserById:`, err.message);
    throw new Error(MESSAGES.EXTERNAL_SERVICE_UNAVAILABLE);
  }

  if (response.status === 404) return null;
  if (!response.ok) {
    console.error(`[MS3->${SERVICE_NAME}] listUserById retornou HTTP ${response.status}`);
    throw new Error(MESSAGES.EXTERNAL_SERVICE_UNAVAILABLE);
  }
  return await response.json();
};

module.exports = { findUserById };
