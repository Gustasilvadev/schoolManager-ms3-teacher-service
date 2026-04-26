const teacherService = require('../services/teacherService');
const { HTTP_STATUS, MESSAGES } = require('../utils/constants');

const createTeacher = async (req, res, next) => {
  try {
    const teacherData = {
      teacher_name: req.body.teacher_name,
      teacher_cpf: req.body.teacher_cpf,
      teacher_email: req.body.teacher_email,
      user_id: req.body.user_id,
      teacher_status: req.body.teacher_status
    };
    const newTeacher = await teacherService.createTeacher(teacherData);
    return res.status(HTTP_STATUS.CREATED).json(newTeacher);
  } catch (error) {
    if (error.message === MESSAGES.EMAIL_ALREADY_EXISTS || error.message === MESSAGES.CPF_ALREADY_EXISTS) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
    }
    next(error);
  }
};

const getAllTeachers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, name, cpf, email, status } = req.query;
    const filters = {};
    if (name) filters.name = name;
    if (cpf) filters.cpf = cpf;
    if (email) filters.email = email;
    if (status !== undefined) filters.status = parseInt(status);

    const result = await teacherService.getAllTeachers(filters, parseInt(page), parseInt(limit));
    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const getTeacherById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacher = await teacherService.getTeacherById(parseInt(id));
    return res.status(HTTP_STATUS.OK).json(teacher);
  } catch (error) {
    if (error.message === MESSAGES.TEACHER_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    next(error);
  }
};

// Endpoint interno serviço-a-serviço (consumido pelo MS1 no login).
// Não exige JWT pois é chamado antes do token existir.
const getTeacherByUserId = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'userId inválido' });
    }
    const teacher = await teacherService.getTeacherByUserId(userId);
    return res.status(HTTP_STATUS.OK).json({ teacher_id: teacher.teacher_id });
  } catch (error) {
    if (error.message === MESSAGES.TEACHER_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    next(error);
  }
};

// Endpoint interno serviço-a-serviço (consumido pelo MS4 ao validar
// alocação de professor em turma). Retorna IDs das disciplinas habilitadas.
const getTeacherDisciplines = async (req, res, next) => {
  try {
    const teacherId = parseInt(req.params.teacherId);
    if (!Number.isInteger(teacherId) || teacherId <= 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'teacherId inválido' });
    }
    const ids = await teacherService.getDisciplineIdsByTeacher(teacherId);
    return res.status(HTTP_STATUS.OK).json({ discipline_ids: ids });
  } catch (error) {
    next(error);
  }
};

const updateTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {};
    if (req.body.teacher_name !== undefined) updateData.teacher_name = req.body.teacher_name;
    if (req.body.teacher_cpf !== undefined) updateData.teacher_cpf = req.body.teacher_cpf;
    if (req.body.teacher_email !== undefined) updateData.teacher_email = req.body.teacher_email;
    if (req.body.teacher_status !== undefined) updateData.teacher_status = req.body.teacher_status;

    const updated = await teacherService.updateTeacher(parseInt(id), updateData);
    return res.status(HTTP_STATUS.OK).json(updated);
  } catch (error) {
    if (error.message === MESSAGES.TEACHER_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    if (error.message === MESSAGES.EMAIL_ALREADY_EXISTS || error.message === MESSAGES.CPF_ALREADY_EXISTS) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
    }
    next(error);
  }
};

const deleteTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    await teacherService.deleteTeacher(parseInt(id));
    return res.status(HTTP_STATUS.OK).json({ message: 'Professor desativado com sucesso' });
  } catch (error) {
    if (error.message === MESSAGES.TEACHER_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    next(error);
  }
};

const associateDiscipline = async (req, res, next) => {
  try {
    const teacherId = parseInt(req.params.id);
    const { discipline_id } = req.body;
    const association = await teacherService.associateDiscipline(teacherId, discipline_id);
    return res.status(HTTP_STATUS.CREATED).json(association);
  } catch (error) {
    if (error.message === MESSAGES.TEACHER_NOT_FOUND || error.message === MESSAGES.DISCIPLINE_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    if (error.message === 'Disciplina já associada a este professor') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
    }
    next(error);
  }
};

const removeDisciplineAssociation = async (req, res, next) => {
  try {
    const teacherId = parseInt(req.params.id);
    const disciplineId = parseInt(req.params.disciplineId);
    await teacherService.removeDisciplineAssociation(teacherId, disciplineId);
    return res.status(HTTP_STATUS.OK).json({ message: 'Associação removida com sucesso' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  getTeacherByUserId,
  getTeacherDisciplines,
  updateTeacher,
  deleteTeacher,
  associateDiscipline,
  removeDisciplineAssociation
};
