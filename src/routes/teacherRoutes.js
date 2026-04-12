const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { validateCreateTeacher, validateUpdateTeacher, validateLinkDiscipline } = require('../middlewares/validationMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware(['ADMIN']));

// Rotas principais de professores
router.get('/listTeachers', teacherController.getAllTeachers);
router.get('/listTeacherById/:id', teacherController.getTeacherById);
router.post('/createTeacher', validateCreateTeacher, teacherController.createTeacher);
router.put('/updateTeacher/:id', validateUpdateTeacher, teacherController.updateTeacher);
router.delete('/deleteTeacher/:id', teacherController.deleteTeacher);

// Rotas de associação de disciplinas
router.post('/linkDiscipline/:id', validateLinkDiscipline, teacherController.associateDiscipline);
router.delete('/unlinkDiscipline/:id/:disciplineId', teacherController.removeDisciplineAssociation);

module.exports = router;