module.exports = {
  ROLES: {
    ADMIN: 'Administrador',
    TEACHER: 'Professor'
  },
  TEACHER_STATUS: {
    ACTIVE: 1,
    INACTIVE: 0,
    DELETED: 2
  },
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  },
  MESSAGES: {
    TOKEN_MISSING: 'Token não fornecido',
    TOKEN_INVALID: 'Token inválido ou expirado',
    FORBIDDEN: 'Acesso negado: permissão insuficiente',
    TEACHER_NOT_FOUND: 'Professor não encontrado',
    EMAIL_ALREADY_EXISTS: 'E-mail já cadastrado',
    CPF_ALREADY_EXISTS: 'CPF já cadastrado',
    INVALID_CPF: 'CPF inválido',
    REQUIRED_FIELD: 'Campo obrigatório não preenchido'
  }
};