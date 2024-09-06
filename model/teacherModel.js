const pool = require('../db');
const bcrypt = require("bcrypt");

const authenticateTeacher = async (email, password) => {
    const result = await pool.query("SELECT * FROM teacher WHERE email = $1", [email]);
    if (result.rows.length > 0) {
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        return isMatch ? user : null;
    }
    return null;
};

const getTeacherByEmail = async (email) => {
    try {
        const result = await pool.query("SELECT * FROM teacher WHERE email = $1", [email]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching teacher by email:', error);
        throw error;
    }
};

/*const getStudents = async (req, res) => {
    return pool.query("SELECT * FROM student ORDER BY id");
}*/

const getStudents = async (req, res) => {
    return pool.query(`
        SELECT s.*, c.grade, c.section, l.lesson, sln.notes
        FROM student s
                 LEFT JOIN classes c ON s.class_id = c.id
                 LEFT JOIN student_lessons_notes sln ON s.id = sln.student_id
                 LEFT JOIN lessons l ON sln.lesson_id = l.l_id
        ORDER BY s.id;
    `);
}

//Teacher should only see his own class notes
const getTeacherStudentsNotes = async (email) => {
    return pool.query(`
        SELECT s.id,
               s.fname,
               s.lname,
               cl.grade,
               cl.section,
               l.lesson,
               sln.notes,
               l.l_id,
               t.id as teacher_id
        FROM student s
                 JOIN
             class_assignments ca ON ca.class_id = s.class_id
                 JOIN
             teacher t ON t.id = ca.teacher_id
                 LEFT JOIN
             lessons l ON l.lesson = t.lesson
                 LEFT JOIN
             student_lessons_notes sln ON sln.student_id = s.id AND sln.lesson_id = l.l_id
                 LEFT JOIN
             classes cl ON cl.id = s.class_id
        WHERE t.email = $1;
    `, [email]);
};

const getClassStudents = async (email) => {
    return pool.query(`
        SELECT s.id,
               s.fname,
               s.lname,
               s.class_id,
               c.grade,
               c.section
        FROM student s
                 JOIN class_assignments ca
                      ON ca.class_id = s.class_id
                 JOIN teacher t
                      ON t.id = ca.teacher_id
                 JOIN classes c
                      ON s.class_id = c.id
        WHERE t.email = $1
        ORDER BY s.id;`, [email]);
};

const getSchedule = async (email) => {
    return pool.query(`
        SELECT sch.id,
               sch.day,
               sch.start_time,
               sch.end_time,
               l.lesson,
               sch.lesson_id,
               c.grade,
               c.section
        FROM schedule sch
             JOIN classes c ON sch.class_id = c.id
             JOIN class_assignments ca ON ca.class_id = c.id
             JOIN teacher t ON t.id = ca.teacher_id
             JOIN lessons l ON sch.lesson_id = l.l_id
        WHERE t.email = $1
        ORDER BY sch.day, sch.start_time;`, [email]);
}


const addStudent = async ({fname, lname, password, email, b_date, class_id, role_id}) => {
    return pool.query("INSERT INTO student (fname, lname, password, email, b_date, class_id, role_id) VALUES ($1, $2, $3, $4, $5, $6, $7)", [fname, lname, password, email, b_date, class_id, role_id]);
};

const updateStudent = async ({fname, lname, password, email, b_date, class_id, role_id, id}) => {
    return pool.query("UPDATE student SET fname = $1, lname = $2, password = $3, email = $4, b_date = $5, class_id = $6, role_id = $7 WHERE id = $8", [fname, lname, password, email, b_date, class_id, role_id, parseInt(id)]);
}

const updateSchedule = async ({day, start_time, end_time, lesson_id, id}) => {
    return pool.query(`
        UPDATE schedule
        SET day = $1,
            start_time = $2,
            end_time = $3,
            lesson_id = $4
        WHERE id = $5;
    `, [day, start_time, end_time, lesson_id, parseInt(id)]);
}


const upsertNotes = async ({ notes, student_id, lesson_id, teacher_id }) => {
    return pool.query(
        `INSERT INTO student_lessons_notes (student_id, lesson_id, notes, teacher_id)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (student_id, lesson_id)
         DO UPDATE SET notes = EXCLUDED.notes, teacher_id = EXCLUDED.teacher_id;`,
        [student_id, lesson_id, notes, teacher_id]
    );
};

const deleteStudent = async (id) => {
    return pool.query("DELETE FROM student WHERE id = $1", [id])
}

const removeStudentClass = async ({id}) => {
    return pool.query("UPDATE student SET class_id = NULL WHERE id = $1", [parseInt(id)]);
}

const updateStudentClass = async ({class_id, id}) => {
    return pool.query("UPDATE student SET class_id = $1 WHERE id = $2", [parseInt(class_id), parseInt(id)]);
}

// In Future Get Students by Class, update class lessons or teachers, notes, sum of notes for class

module.exports = {
    getStudents,
    getTeacherStudentsNotes,
    getClassStudents,
    getSchedule,
    addStudent,
    updateStudent,
    upsertNotes,
    deleteStudent,
    authenticateTeacher,
    getTeacherByEmail,
    removeStudentClass,
    updateStudentClass,
    updateSchedule
}