const {Router} = require('express');
const router = new Router();
const adminController = require('../controller/adminController');
const studentController = require('../controller/studentController');
const teacherController = require('../controller/teacherController');
const authenticateToken = require('../middleware/authMiddleware')

// Admin Routes

// Get
router.get('/teachers', adminController.getTeachers);
router.get('/students', adminController.getStudents);
router.get('/admin/:username', adminController.getAdminByUsername)
router.get('/class-assignments', adminController.getClassAssignments)


// Post
router.post('/add-teacher', adminController.addTeacher);
router.post('/add-student', adminController.addStudent);
router.post('/add-assignments', adminController.addClassAssignments)



// Put
router.put('/update-teacher', adminController.updateTeacher);
router.put('/update-student', adminController.updateStudent);
router.put('/update-assignments', adminController.updateClassAssignments)



// Delete
router.delete('/delete-teacher/:id', adminController.deleteTeacher);
router.delete('/delete-student/:id', adminController.deleteStudent);
router.delete('/delete-assignments/:id', adminController.deleteClassAssignments)




// Student Routes

// Get
router.get('/notes', authenticateToken, studentController.getNotes);
// router.get('/sum-notes', studentController.getNotesSum);
router.get('/lessons', studentController.getLessons);
router.get('/student/:id', studentController.getStudentById)
router.get('/absenteeism', authenticateToken, studentController.getAbsenteeism)
router.get('/student-schedule', authenticateToken, studentController.getSchedule)


// Teacher Routes

// Get
router.get('/your-students', teacherController.getStudents)
router.get('/teacher/:email', teacherController.getTeacherByEmail)
router.get('/your-notes', authenticateToken, teacherController.getTeacherStudentsNotes)
router.get('/your-class', authenticateToken, teacherController.getClassStudents)
router.get('/schedule', authenticateToken, teacherController.getSchedule)

// Post
router.post('/create-student', teacherController.addStudent);

// Put
router.put('/updt-student', teacherController.updateStudent);
router.put('/upsert-notes', authenticateToken, teacherController.upsertNotes)
router.put('/remove-class', teacherController.removeStudentClass)
router.put('/updt-class-student', teacherController.updateStudentClass)
router.put('/update-schedule', authenticateToken, teacherController.updateSchedule)

// Delete
router.delete('/dlt-student/:id', teacherController.deleteStudent);

// Register - Login

router.get('/protected', authenticateToken, (req, res) => {
    res.send('This is a protected route');
});

router.post('/student-login', studentController.authenticateStudent);

router.post('/register', studentController.registerStudent);

router.post('/login-teacher', teacherController.authenticateTeacher);

router.post('/login-admin', adminController.authenticateAdmin);



module.exports = router;