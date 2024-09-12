const sql = require('../db');
const bcrypt = require("bcrypt");

const authenticateTeacher = async (email, password) => {
    const result = await sql`SELECT * FROM teacher WHERE email = ${email}`;
    if (result.length > 0) {
        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);
        return isMatch ? user : null;
    }
    return null;
};

const getTeacherByEmail = async (email) => {
    try {
        const result = await sql`SELECT * FROM teacher WHERE email = ${email}`;
        return result[0];
    } catch (error) {
        console.error('Error fetching teacher by email:', error);
        throw error;
    }
};

const getStudents = async () => {
    return sql`
        SELECT s.*, c.grade, c.section, l.lesson, sln.notes
        FROM student s
        LEFT JOIN classes c ON s.class_id = c.id
        LEFT JOIN student_lessons_notes sln ON s.id = sln.student_id
        LEFT JOIN lessons l ON sln.lesson_id = l.l_id
        ORDER BY s.id;
    `;
};

const getTeacherStudentsNotes = async (email) => {
    return sql`
        SELECT s.id, s.fname, s.lname, cl.grade, cl.section, l.lesson, sln.notes, l.l_id, t.id as teacher_id
        FROM student s
        JOIN class_assignments ca ON ca.class_id = s.class_id
        JOIN teacher t ON t.id = ca.teacher_id
        LEFT JOIN lessons l ON l.lesson = t.lesson
        LEFT JOIN student_lessons_notes sln ON sln.student_id = s.id AND sln.lesson_id = l.l_id
        LEFT JOIN classes cl ON cl.id = s.class_id
        WHERE t.email = ${email};
    `;
};

const getClassStudents = async (email) => {
    return sql`
        SELECT s.id, s.fname, s.lname, s.class_id, c.grade, c.section
        FROM student s
        JOIN class_assignments ca ON ca.class_id = s.class_id
        JOIN teacher t ON t.id = ca.teacher_id
        JOIN classes c ON s.class_id = c.id
        WHERE t.email = ${email}
        ORDER BY s.id;
    `;
};

const getSchedule = async (email) => {
    return sql`
        SELECT sch.id, sch.day, sch.start_time, sch.end_time, l.lesson, sch.lesson_id, c.grade, c.section
        FROM schedule sch
        JOIN classes c ON sch.class_id = c.id
        JOIN class_assignments ca ON ca.class_id = c.id
        JOIN teacher t ON t.id = ca.teacher_id
        JOIN lessons l ON sch.lesson_id = l.l_id
        WHERE t.email = ${email}
        ORDER BY sch.day, sch.start_time;
    `;
};

const addStudent = async ({fname, lname, password, email, b_date, class_id, role_id}) => {
    return sql`
        INSERT INTO student (fname, lname, password, email, b_date, class_id, role_id)
        VALUES (${fname}, ${lname}, ${password}, ${email}, ${b_date}, ${class_id}, ${role_id});
    `;
};

const updateStudent = async ({fname, lname, password, email, b_date, class_id, role_id, id}) => {
    return sql`
        UPDATE student
        SET fname = ${fname}, lname = ${lname}, password = ${password}, email = ${email}, b_date = ${b_date}, class_id = ${class_id}, role_id = ${role_id}
        WHERE id = ${parseInt(id)};
    `;
};

const updateSchedule = async ({day, start_time, end_time, lesson_id, id}) => {
    return sql`
        UPDATE schedule
        SET day = ${day}, start_time = ${start_time}, end_time = ${end_time}, lesson_id = ${lesson_id}
        WHERE id = ${parseInt(id)};
    `;
};

const upsertNotes = async ({notes, student_id, lesson_id, teacher_id}) => {
    return sql`
        INSERT INTO student_lessons_notes (student_id, lesson_id, notes, teacher_id)
        VALUES (${student_id}, ${lesson_id}, ${notes}, ${teacher_id})
        ON CONFLICT (student_id, lesson_id)
        DO UPDATE SET notes = EXCLUDED.notes, teacher_id = EXCLUDED.teacher_id;
    `;
};

const deleteStudent = async (id) => {
    return sql`DELETE FROM student WHERE id = ${id}`;
};

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
    updateSchedule
};
