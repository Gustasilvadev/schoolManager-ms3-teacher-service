const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { validateCreateTeacher, validateUpdateTeacher, validateLinkDiscipline } = require('../middlewares/validationMiddleware');

// Endpoints internos (serviço-a-serviço) — ficam antes do authMiddleware.
// /byUser: consumido pelo MS1 no login para enriquecer o JWT com teacher_id.
// /disciplines: consumido pelo MS4 ao validar alocação de professor em turma.
router.get('/byUser/:userId', teacherController.getTeacherByUserId);
router.get('/disciplines/:teacherId', teacherController.getTeacherDisciplines);

router.use(authMiddleware);
router.use(roleMiddleware(['ADMIN']));

// Rotas principais de professores
router.get('/listTeachers', teacherController.getAllTeachers);
router.get('/listTeacherById/:id', teacherController.getTeacherById);
router.post('/createTeacher', validateCreateTeacher, teacherController.createTeacher);
router.put('/updateTeacherById/:id', validateUpdateTeacher, teacherController.updateTeacher);
router.delete('/deleteTeacherById/:id', teacherController.deleteTeacher);

// Rotas de associação de disciplinas
router.post('/linkDiscipline/:id', validateLinkDiscipline, teacherController.associateDiscipline);
router.delete('/unlinkDiscipline/:id/:disciplineId', teacherController.removeDisciplineAssociation);

module.exports = router;