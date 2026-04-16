const { body, validationResult } = require('express-validator');
const { HTTP_STATUS } = require('../utils/constants');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
};

// Validação para criação de professor
const validateCreateTeacher = [
  body('teacher_name')
    .notEmpty().withMessage('Nome do professor é obrigatório')
    .isLength({ max: 45 }).withMessage('O nome deve ter no máximo 45 caracteres'),
  
  body('teacher_cpf')
    .notEmpty().withMessage('CPF é obrigatório')
    .isLength({ max: 15 }).withMessage('O CPF deve ter no máximo 15 caracteres'),

  body('teacher_email')
    .isEmail().withMessage('E-mail inválido')
    .isLength({ max: 45 }).withMessage('O e-mail deve ter no máximo 45 caracteres'),
  
  body('user_id')
    .notEmpty().withMessage('O ID de usuário (user_id) é obrigatório'),
  
  validate
];

// Validação para atualização de professor
const validateUpdateTeacher = [
  body('teacher_name')
    .optional()
    .notEmpty().withMessage('O nome não pode estar vazio')
    .isLength({ max: 45 }).withMessage('O nome deve ter no máximo 45 caracteres'),
  
  body('teacher_cpf')
    .optional()
    .notEmpty().withMessage('O CPF não pode estar vazio')
    .isLength({ max: 15 }).withMessage('O CPF deve ter no máximo 15 caracteres'),
  
  body('teacher_email')
    .optional()
    .isEmail().withMessage('E-mail inválido')
    .isLength({ max: 45 }).withMessage('O e-mail deve ter no máximo 45 caracteres'),
  
  body('teacher_status')
    .optional()
    .isInt({ min: 0, max: 2 }).withMessage('Status deve ser 0, 1 ou 2'),
  
  validate
];

// Validação para vincular disciplina a professor
const validateLinkDiscipline = [
  body('discipline_id')
    .notEmpty().withMessage('ID da disciplina é obrigatório')
    .isInt().withMessage('ID da disciplina deve ser um número inteiro'),
  
  validate
];

module.exports = {
  validateCreateTeacher,
  validateUpdateTeacher,
  validateLinkDiscipline,
};