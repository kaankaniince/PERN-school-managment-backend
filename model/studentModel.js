const pool = require('../db');
const bcrypt = require('bcrypt');

const registerStudent = async (fname, lname, email, password, b_date) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const role_id = 3;
    return pool.query(
        "INSERT INTO student (fname, lname, email, password, b_date, role_id) VALUES ($1, $2, $3, $4, $5, $6)", [fname, lname, email, hashedPassword, b_date, role_id]);
}

const authenticateStudent = async (id, password) => {
    const result = await pool.query("SELECT * FROM student WHERE id = $1", [id]);
    if (result.rows.length > 0) {
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        return isMatch ? user : null;
    }
    return null;
};

const getStudentById = async (id) => {
    try {
        const result = await pool.query("SELECT * FROM student WHERE id = $1", [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching student by ID:', error);
        throw error;
    }
};

const getNotes = async (id) => {
    return pool.query(`
        SELECT s.id,
               s.fname,
               s.lname,
               s.email,
               s.b_date,
               s.class_id,
               s.school_absence,
               l.l_id,
               l.lesson,
               sn.notes
        FROM student s
                 JOIN student_lessons_notes sn ON s.id = sn.student_id
                 JOIN lessons l ON sn.lesson_id = l.l_id
        WHERE s.id = $1;
    `, [parseInt(id)]);
};

/*const getNotesSum = async (req, res) => {
    return pool.query(`
        SELECT s.fname, s.lname, AVG(sln.notes) AS "avg_of_notes"
        FROM student s
                 JOIN student_lessons_notes sln ON s.id = sln.student_id
        GROUP BY s.fname, s.lname
        ORDER BY s.fname
    `);
};*/


const getLessons = async (req, res) => {
    return pool.query("SELECT lesson FROM lessons ORDER BY lesson");
};

const getAbsenteeism = async (id) => {
    return pool.query(`
        SELECT 
            a.id,
            a.created_at,
            s.school_absence
        FROM absenteeism a
                 JOIN student s ON a.student_id = s.id
        WHERE s.id = $1
        ORDER BY a.created_at;
    `, [parseInt(id)]);
};

const getSchedule = async (id) => {
    return pool.query(`
        SELECT sch.id,
               sch.day,
               sch.start_time,
               sch.end_time,
               l.lesson,
               c.grade,
               c.section
        FROM schedule sch
             JOIN classes c ON sch.class_id = c.id
             JOIN lessons l ON sch.lesson_id = l.l_id
             JOIN student s ON s.class_id = c.id
        WHERE s.id = $1
        ORDER BY sch.day, sch.start_time;`, [id]);
}


module.exports = {
    getNotes,
    // getNotesSum,
    getLessons,
    registerStudent,
    authenticateStudent,
    getStudentById,
    getAbsenteeism,
    getSchedule
}