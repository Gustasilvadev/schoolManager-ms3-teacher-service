const prisma = require('../config/prisma');
const { TEACHER_STATUS } = require('../utils/constants');

/**
 * Busca uma lista paginada de professores, aplica filtros opcionais (nome parcial e status) 
 * e retorna os resultados incluindo os dados das disciplinas vinculadas a cada professor.
 */
const findAll = async (skip, take, where = {}) => {
  return await prisma.teachers.findMany({
    where,               // ← usa o where recebido diretamente
    skip,
    take,
    orderBy: { teacher_id: 'asc' }
  });
};

const findById = async (id) => {
  return await prisma.teachers.findUnique({
    where: { teacher_id: id }
  });

};

const findByEmail = async (email) => {
  return await prisma.teachers.findUnique({ where: { teacher_email: email } });
};

const findByCpf = async (cpf) => {
  return await prisma.teachers.findUnique({
    where: { teacher_cpf: cpf }
  });
};

const findByUserId = async (userId) => {
  return await prisma.teachers.findFirst({
    where: { user_id: userId, teacher_status: TEACHER_STATUS.ACTIVE }
  });
};

const create = async (data) => {
  return await prisma.teachers.create({ data });
};

const update = async (id, data) => {
  return await prisma.teachers.update({ where: { teacher_id: id }, data });
};

const softDelete = async (id) => {
  const result = await prisma.teachers.update({
    where: { teacher_id: id },
    data: { teacher_status: TEACHER_STATUS.DELETED }
  });
  return result;
};

const count = async (where = {}) => {
  return await prisma.teachers.count({ where });
};

module.exports = {
    findAll,
    findById,
    findByEmail,
    findByCpf,
    findByUserId,
    create,
    update,
    softDelete,
    count
};