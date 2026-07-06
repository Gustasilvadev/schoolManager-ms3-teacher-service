const prisma = require('../config/prisma');

/**
 * Associa uma disciplina a um professor
 */
const associate = async (teacherId, disciplineId) => {
  return await prisma.teacher_disciplines.create({
    data: {
      teacher_id: teacherId,
      discipline_id: disciplineId
    }
  });
};

/**
 * Remove a associação entre professor e disciplina
 */
const removeAssociation = async (teacherId, disciplineId) => {
  return await prisma.teacher_disciplines.deleteMany({
    where: {
      teacher_id: teacherId,
      discipline_id: disciplineId
    }
  });
};

/**
 * Verifica se já existe uma associação entre professor e disciplina
 */
const findByTeacherAndDiscipline = async (teacherId, disciplineId) => {
  return await prisma.teacher_disciplines.findFirst({
    where: {
      teacher_id: teacherId,
      discipline_id: disciplineId
    }
  });
};

/**
 * Lista todas as disciplinas habilitadas para um professor
 */
const findByTeacher = async (teacherId) => {
  return await prisma.teacher_disciplines.findMany({
    where: { teacher_id: teacherId }
  });
};

/**
 * Conta disciplinas habilitadas para vários professores numa única query.
 */
const countByTeacherIds = async (teacherIds) => {
  if (!teacherIds || teacherIds.length === 0) return {};
  const rows = await prisma.teacher_disciplines.groupBy({
    by: ['teacher_id'],
    where: { teacher_id: { in: teacherIds } },
    _count: { discipline_id: true }
  });
  return rows.reduce((acc, row) => {
    acc[row.teacher_id] = row._count.discipline_id;
    return acc;
  }, {});
};

module.exports = {
  associate,
  removeAssociation,
  findByTeacherAndDiscipline,
  findByTeacher,
  countByTeacherIds
};