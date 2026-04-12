const { verifyToken } = require('../utils/jwtHelper');
const { extractTokenFromHeader } = require('../utils/jwtHelper');
const { HTTP_STATUS, MESSAGES } = require('../utils/constants');

/**
 * Middleware para autenticar requisições via JWT.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: MESSAGES.TOKEN_MISSING });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: MESSAGES.TOKEN_INVALID });
  }

  req.user = decoded;
  next();
};

module.exports = authMiddleware;