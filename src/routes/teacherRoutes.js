const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { validateCreateTeacher, validateUpdateTeacher, validateLinkDiscipline } = require('../middlewares/validationMiddleware');

// Endpoints internos serviço-a-serviço — declarados antes do authMiddleware pois não exigem JWT.
router.get('/byUser/:userId', teacherController.getTeacherByUserId);
router.get('/byCpf/:cpf', teacherController.getTeacherByCpf);
router.get('/byEmail/:email', teacherController.getTeacherByEmail);
router.get('/disciplines/:teacherId', teacherController.getTeacherDisciplines);

router.use(authMiddleware);
router.use(roleMiddleware(['ADMIN']));

router.get('/listTeachers', teacherController.getAllTeachers);
router.get('/listTeacherById/:id', teacherController.getTeacherById);
router.post('/createTeacher', validateCreateTeacher, teacherController.createTeacher);
router.put('/updateTeacherById/:id', validateUpdateTeacher, teacherController.updateTeacher);
router.delete('/deleteTeacherById/:id', teacherController.deleteTeacher);

router.post('/linkDiscipline/:id', validateLinkDiscipline, teacherController.associateDiscipline);
router.delete('/unlinkDiscipline/:id/:disciplineId', teacherController.removeDisciplineAssociation);

module.exports = router;