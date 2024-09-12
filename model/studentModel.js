const sql = require('../db');
const bcrypt = require('bcrypt');

const registerStudent = async (fname, lname, email, password, b_date) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const role_id = 3;
    return sql`
        INSERT INTO student (fname, lname, email, password, b_date, role_id)
        VALUES (${fname}, ${lname}, ${email}, ${hashedPassword}, ${b_date}, ${role_id});
    `;
};

const authenticateStudent = async (id, password) => {
    const result = await sql`SELECT * FROM student WHERE id = ${id}`;
    if (result.length > 0) {
        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);
        return isMatch ? user : null;
    }
    return null;
};

const getStudentById = async (id) => {
    try {
        const result = await sql`SELECT * FROM student WHERE id = ${id}`;
        return result[0];
    } catch (error) {
        console.error('Error fetching student by ID:', error);
        throw error;
    }
};

const getNotes = async (id) => {
    return sql`
        SELECT s.id, s.fname, s.lname, s.email, s.b_date, s.class_id, s.school_absence,
               l.l_id, l.lesson, sn.notes
        FROM student s
        JOIN student_lessons_notes sn ON s.id = sn.student_id
        JOIN lessons l ON sn.lesson_id = l.l_id
        WHERE s.id = ${parseInt(id)};
    `;
};

const getLessons = async () => {
    return sql`SELECT lesson FROM lessons ORDER BY lesson`;
};

const getAbsenteeism = async (id) => {
    return sql`
        SELECT a.id, a.created_at, s.school_absence
        FROM absenteeism a
        JOIN student s ON a.student_id = s.id
        WHERE s.id = ${parseInt(id)}
        ORDER BY a.created_at;
    `;
};

const getSchedule = async (id) => {
    return sql`
        SELECT sch.id, sch.day, sch.start_time, sch.end_time, l.lesson, c.grade, c.section
        FROM schedule sch
        JOIN classes c ON sch.class_id = c.id
        JOIN lessons l ON sch.lesson_id = l.l_id
        JOIN student s ON s.class_id = c.id
        WHERE s.id = ${id}
        ORDER BY sch.day, sch.start_time;
    `;
};

module.exports = {
    getNotes,
    getLessons,
    registerStudent,
    authenticateStudent,
    getStudentById,
    getAbsenteeism,
    getSchedule,
};
