const jwt = require('jsonwebtoken');

/**
 * Verifica a validade de um token.
 */
const verifyToken = (token, secret = null) => {
  try {
    const usedSecret = secret || process.env.JWT_SECRET;
    return jwt.verify(token, usedSecret);
  } catch (error) {
    return false;
  }
};

/**
 * Extrai o token do header Authorization (Bearer token).
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1];
};

module.exports = {
  verifyToken,
  extractTokenFromHeader
};