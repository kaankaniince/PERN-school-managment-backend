const sql = require('../db');
const bcrypt = require("bcrypt");

const authenticateAdmin = async (username, password) => {
    const result = await sql`SELECT * FROM admin WHERE username = ${username}`;
    if (result.length > 0) {
        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);
        return isMatch ? user : null;
    }
    return null;
};

const getAdminByUsername = async (username) => {
    try {
        const result = await sql`SELECT * FROM admin WHERE username = ${username}`;
        return result?.rows[0];
    } catch (error) {
        console.error('Error fetching admin by username:', error);
        throw error;
    }
};

const getTeachers = async (req, res) => {
    return sql`SELECT * FROM teacher ORDER BY id`;
}

const getStudents = async (req, res) => {
    return sql`
        SELECT s.*, c.grade, c.section
        FROM student s
        LEFT JOIN classes c ON s.class_id = c.id
        ORDER BY s.id;
    `;
}

const getClassAssignments = async (req, res) => {
    return sql`
        SELECT ca.*,
               t.fname,
               t.lname,
               c.grade,
               c.section
        FROM class_assignments ca
        JOIN teacher t ON ca.teacher_id = t.id
        JOIN classes c ON ca.class_id = c.id
    `;
}

const addTeacher = async ({fname, lname, email, password, lesson, role_id}) => {
    return sql`INSERT INTO teacher (fname, lname, email, password, lesson, role_id) VALUES (${fname}, ${lname}, ${email}, ${password}, ${lesson}, ${role_id})`;
}

const addStudent = async ({fname, lname, password, email, b_date, class_id, role_id}) => {
    return sql`INSERT INTO student (fname, lname, password, email, b_date, class_id, role_id) VALUES (${fname}, ${lname}, ${password}, ${email}, ${b_date}, ${class_id}, ${role_id})`;
}

const addClassAssignments = async ({teacher_id, class_id}) => {
    return sql`INSERT INTO class_assignments (teacher_id, class_id) VALUES (${teacher_id}, ${class_id})`;
}

const deleteTeacher = async (id) => {
    return sql`DELETE FROM teacher WHERE id = ${id}`;
}

const deleteStudent = async (id) => {
    return sql`DELETE FROM student WHERE id = ${id}`;
}

const deleteClassAssignments = async (id) => {
    return sql`DELETE FROM class_assignments WHERE id = ${id}`;
}

const updateTeacher = async ({fname, lname, email, password, lesson, role_id, id}) => {
    return sql`UPDATE teacher SET fname = ${fname}, lname = ${lname}, email = ${email}, password = ${password}, lesson = ${lesson}, role_id = ${role_id} WHERE id = ${parseInt(id)}`;
}

const updateStudent = async ({fname, lname, password, email, b_date, class_id, role_id, id}) => {
    return sql`UPDATE student SET fname = ${fname}, lname = ${lname}, password = ${password}, email = ${email}, b_date = ${b_date}, class_id = ${class_id}, role_id = ${role_id} WHERE id = ${parseInt(id)}`;
}

const updateClassAssignments = async ({teacher_id, class_id, id}) => {
    return sql`UPDATE class_assignments SET teacher_id = ${teacher_id}, class_id = ${class_id} WHERE id = ${parseInt(id)}`;
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
