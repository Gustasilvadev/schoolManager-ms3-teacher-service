module.exports = {
  ROLES: {
    ADMIN: 'ADMIN',
    TEACHER: 'TEACHER'
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
    TEACHER_INACTIVE: 'Professor inativo não pode ter disciplinas associadas',
    DISCIPLINE_NOT_FOUND: 'Disciplina não encontrada',
    ASSOCIATION_NOT_FOUND: 'Associação entre professor e disciplina não encontrada',
    ASSOCIATION_ALREADY_EXISTS: 'Disciplina já associada a este professor',
    USER_NOT_FOUND: 'Usuário não encontrado',
    EMAIL_ALREADY_EXISTS: 'E-mail já cadastrado',
    CPF_ALREADY_EXISTS: 'CPF já cadastrado',
    INVALID_CPF: 'CPF inválido',
    REQUIRED_FIELD: 'Campo obrigatório não preenchido',
    EXTERNAL_SERVICE_UNAVAILABLE: 'Serviço externo indisponível'
  }
};