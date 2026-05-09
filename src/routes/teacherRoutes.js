const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { validateCreateTeacher, validateUpdateTeacher, validateLinkDiscipline } = require('../middlewares/validationMiddleware');

// Endpoint interno serviço-a-serviço — chamado pelo MS1 durante o login (token ainda não foi gerado).
// O API Gateway DEVE bloquear o acesso externo a esta rota.
router.get('/byUser/:userId', teacherController.getTeacherByUserId);

router.use(authMiddleware);

const ADMIN_ONLY = roleMiddleware(['ADMIN']);
const ADMIN_OR_TEACHER = roleMiddleware(['ADMIN', 'TEACHER']);

// Endpoints utilitários para validação cross-MS — exigem JWT propagado (ADMIN para os fluxos de createUser/createNotice).
router.get('/byCpf/:cpf', ADMIN_ONLY, teacherController.getTeacherByCpf);
router.get('/byEmail/:email', ADMIN_ONLY, teacherController.getTeacherByEmail);
router.get('/disciplines/:teacherId', ADMIN_OR_TEACHER, teacherController.getTeacherDisciplines);

router.get('/listTeachers', ADMIN_ONLY, teacherController.getAllTeachers);
router.get('/listTeacherById/:id', ADMIN_ONLY, teacherController.getTeacherById);
router.post('/createTeacher', ADMIN_ONLY, validateCreateTeacher, teacherController.createTeacher);
router.put('/updateTeacherById/:id', ADMIN_ONLY, validateUpdateTeacher, teacherController.updateTeacher);
router.delete('/deleteTeacherById/:id', ADMIN_ONLY, teacherController.deleteTeacher);

router.post('/linkDiscipline/:id', ADMIN_ONLY, validateLinkDiscipline, teacherController.associateDiscipline);
router.delete('/unlinkDiscipline/:id/:disciplineId', ADMIN_ONLY, teacherController.removeDisciplineAssociation);

module.exports = router;