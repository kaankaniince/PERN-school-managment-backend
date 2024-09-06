const pool = require('../db');
const bcrypt = require("bcrypt");

const authenticateAdmin = async (username, password) => {
    const result = await pool.query("SELECT * FROM admin WHERE username = $1", [username]);
    if (result.rows.length > 0) {
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        return isMatch ? user : null;
    }
    return null;

};

 const getAdminByUsername = async (username) => {
    try {
        const result = await pool.query("SELECT * FROM admin WHERE username = $1", [username]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching admin by username:', error);
        throw error;
    }
};

const getTeachers = async (req, res) => {
    return pool.query("SELECT * FROM teacher ORDER BY id");
}

const getStudents = async (req, res) => {
    return pool.query(`
        SELECT s.*, c.grade, c.section
        FROM student s
                 LEFT JOIN classes c ON s.class_id = c.id
        ORDER BY s.id;
    `);
}

const getClassAssignments = async (req, res) => {
    return pool.query(`
        SELECT ca.*,
               t.fname,
               t.lname,
               c.grade,
               c.section
        FROM class_assignments ca
                 JOIN
             teacher t ON ca.teacher_id = t.id
                 JOIN
             classes c ON ca.class_id = c.id
    `);
}

const addTeacher = async ({fname, lname, email, password, lesson, role_id}) => {
    return pool.query("INSERT INTO teacher (fname, lname, email, password, lesson, role_id) VALUES ($1, $2, $3, $4, $5, $6)", [fname, lname, email, password, lesson, role_id]);
}

const addStudent = async ({fname, lname, password, email, b_date, class_id, role_id}) => {
    return pool.query("INSERT INTO student (fname, lname, password, email, b_date, class_id, role_id) VALUES ($1, $2, $3, $4, $5, $6, $7)", [fname, lname, password, email, b_date, class_id, role_id]);
}

const addClassAssignments = async ({teacher_id, class_id}) => {
    return pool.query("INSERT INTO class_assignments (teacher_id, class_id) VALUES ($1, $2)", [teacher_id, class_id]);
}

const deleteTeacher = async (id) => {
    return pool.query("DELETE FROM teacher WHERE id = $1", [id])
}

const deleteStudent = async (id) => {
    return pool.query("DELETE FROM student WHERE id = $1", [id])
}

const deleteClassAssignments = async (id) => {
    return pool.query("DELETE FROM class_assignments WHERE id = $1", [id])
}

const updateTeacher = async ({fname, lname, email, password, lesson, role_id, id}) => {
    return pool.query("UPDATE teacher SET fname = $1, lname = $2, email = $3, password = $4, lesson = $5, role_id = $6 WHERE id = $7", [fname, lname, email, password, lesson, role_id, parseInt(id)]);
}

const updateStudent = async ({fname, lname, password, email, b_date, class_id, role_id, id}) => {
    return pool.query("UPDATE student SET fname = $1, lname = $2, password = $3, email = $4, b_date = $5, class_id = $6, role_id = $7 WHERE id = $8", [fname, lname, password, email, b_date, class_id, role_id, parseInt(id)]);
}

const updateClassAssignments = async ({teacher_id, class_id, id}) => {
    return pool.query("UPDATE class_assignments SET teacher_id = $1, class_id = $2 WHERE id = $3", [teacher_id, class_id, parseInt(id)]);
}

module.exports = {
    getTeachers,
    getStudents,
    getClassAssignments,
    addTeacher,
    addStudent,
    addClassAssignments,
    deleteTeacher,
    deleteStudent,
    deleteClassAssignments,
    updateTeacher,
    updateStudent,
    updateClassAssignments,
    authenticateAdmin,
    getAdminByUsername
}