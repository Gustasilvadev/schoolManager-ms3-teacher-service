const prisma = require('../config/prisma');
const { TEACHER_STATUS } = require('../utils/constants');

/**
 * Busca uma lista paginada de professores, aplica filtros opcionais (nome parcial e status) 
 * e retorna os resultados incluindo os dados das disciplinas vinculadas a cada professor.
 */
const findAll = async (skip, take, filters = {}) => {
  const where = {};
  if (filters.name) where.teacher_name = { contains: filters.name };
  if (filters.status !== undefined) where.teacher_status = filters.status;
  return await prisma.teachers.findMany({
    where,
    skip,
    take,
    include: { teacher_disciplines: { include: { discipline: true } } }
  });
};

const findById = async (id) => {
  return await prisma.teachers.findUnique({
    where: { teacher_id: id },
    include: { teacher_disciplines: { include: { discipline: true } } }
  });
};

const findByEmail = async (email) => {
  return await prisma.teachers.findUnique({ where: { teacher_email: email } });
};

const create = async (data) => {
  return await prisma.teachers.create({ data });
};

const update = async (id, data) => {
  return await prisma.teachers.update({ where: { teacher_id: id }, data });
};

const softDelete = async (id) => {
  return await prisma.teachers.update({
    where: { teacher_id: id },
    data: { teacher_status: TEACHER_STATUS.DELETED }
  });
};

module.exports = { 
    findAll, 
    findById, 
    findByEmail, 
    create, 
    update, 
    softDelete 
};