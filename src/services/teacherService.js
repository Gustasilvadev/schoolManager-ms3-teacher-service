const teacherRepo = require('../repositories/teacherRepository');
const teacherDisciplineRepo = require('../repositories/teacherDisciplineRepository');
const { MESSAGES, TEACHER_STATUS } = require('../utils/constants');

/**
 * Cria um novo professor
 */
const createTeacher = async (teacherData) => {
  const existingEmail = await teacherRepo.findByEmail(teacherData.teacher_email);
  if (existingEmail) throw new Error(MESSAGES.EMAIL_ALREADY_EXISTS);

  const existingCpf = await teacherRepo.findByCpf(teacherData.teacher_cpf);
  if (existingCpf) throw new Error(MESSAGES.CPF_ALREADY_EXISTS);

  const newTeacher = await teacherRepo.create({
    teacher_name: teacherData.teacher_name,
    teacher_cpf: teacherData.teacher_cpf,
    teacher_email: teacherData.teacher_email,
    user_id: teacherData.user_id,
    teacher_status: teacherData.teacher_status !== undefined ? teacherData.teacher_status : TEACHER_STATUS.ACTIVE
  });

  // FUTURO: publicar evento TeacherCreated no RabbitMQ para criar usuário no AuthService

  return newTeacher;
};

/**
 * Lista professores com paginação e filtros
 */
const getAllTeachers = async (filters = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const where = {};

   if (filters.name && filters.name.trim() !== '') {
    where.teacher_name = { contains: filters.name };
  }
  if (filters.cpf && filters.cpf.trim() !== '') {
    where.teacher_cpf = { contains: filters.cpf };
  }
  if (filters.email && filters.email.trim() !== '') {
    where.teacher_email = { contains: filters.email };
  }

  const teachers = await teacherRepo.findAll(skip, limit, where);
  const total = await teacherRepo.count(where);
  return { teachers, total, page, limit };
};

/**
 * Busca professor por ID
 */
const getTeacherById = async (id) => {
  const teacher = await teacherRepo.findById(id);
  if (!teacher) throw new Error(MESSAGES.TEACHER_NOT_FOUND);
  return teacher;
};

const getTeacherByUserId = async (userId) => {
  const teacher = await teacherRepo.findByUserId(userId);
  if (!teacher) throw new Error(MESSAGES.TEACHER_NOT_FOUND);
  return teacher;
};

const getDisciplineIdsByTeacher = async (teacherId) => {
  const links = await teacherDisciplineRepo.findByTeacher(teacherId);
  return links.map((l) => l.discipline_id);
};

/**
 * Atualiza dados de um professor
 */
const updateTeacher = async (id, updateData) => {
  const existing = await teacherRepo.findById(id);
  if (!existing) throw new Error(MESSAGES.TEACHER_NOT_FOUND);

  if (updateData.teacher_email && updateData.teacher_email !== existing.teacher_email) {
    const emailExists = await teacherRepo.findByEmail(updateData.teacher_email);
    if (emailExists) throw new Error(MESSAGES.EMAIL_ALREADY_EXISTS);
  }

  if (updateData.teacher_cpf && updateData.teacher_cpf !== existing.teacher_cpf) {
    const cpfExists = await teacherRepo.findByCpf(updateData.teacher_cpf);
    if (cpfExists) throw new Error(MESSAGES.CPF_ALREADY_EXISTS);
  }

  const updated = await teacherRepo.update(id, updateData);
  return updated;
};

/**
 * Exclusão lógica do professor
 */
const deleteTeacher = async (id) => {
  const teacher = await teacherRepo.findById(id);
  if (!teacher) throw new Error(MESSAGES.TEACHER_NOT_FOUND);
  await teacherRepo.softDelete(id);
  return true;
};

/**
 * Associa uma disciplina a um professor
 */
const associateDiscipline = async (teacherId, disciplineId) => {
  const teacher = await teacherRepo.findById(teacherId);
  if (!teacher) throw new Error(MESSAGES.TEACHER_NOT_FOUND);
  const existing = await teacherDisciplineRepo.findByTeacherAndDiscipline(teacherId, disciplineId);
  if (existing) throw new Error('Disciplina já associada a este professor');

  const association = await teacherDisciplineRepo.associate(teacherId, disciplineId);
  return association;
};

/**
 * Remove associação entre professor e disciplina.
 */
const removeDisciplineAssociation = async (teacherId, disciplineId) => {
  await teacherDisciplineRepo.removeAssociation(teacherId, disciplineId);
};

module.exports = {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  getTeacherByUserId,
  getDisciplineIdsByTeacher,
  updateTeacher,
  deleteTeacher,
  associateDiscipline,
  removeDisciplineAssociation
};
