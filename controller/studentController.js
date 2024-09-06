const pool = require("../db");
const studentModel = require("../model/studentModel");
const jwt = require('jsonwebtoken');

const registerStudent = async (req, res) => {
    try {
        const { fname, lname, email, password, b_date } = req.body;
        await studentModel.registerStudent(fname, lname, email, password, b_date);
        res.status(201).send("Student registered successfully");
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred during registration");
    }
};

const authenticateStudent = async (req, res) => {
    try {
        const { id, password } = req.body;
        const user = await studentModel.authenticateStudent(id, password);
        if (user) {
            const token = jwt.sign({ id: user.id, role: user.role_id }, '9a78cd3ea8e4f710862a5ff757eabe16d78111a8e220280b76ba26bbd4d6db2d', { expiresIn: '1h' });
            res.status(200).json({ status: true, access_token: token, user: { id: user.id, role: user.role_id } });
        } else {
            res.status(401).send("Invalid credentials");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred during login");
    }
};

const getNotes = async (req, res) => {
    try {
        const id = req.user.id
        const result = await studentModel.getNotes(id);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching notes:', err);
        res.status(500).send('An error occurred while getting the notes');
    }
};
/*const getNotesSum = async (req, res) => {
    try {
        const getNotesSum = await studentModel.getNotesSum();
        res.status(200).json(getNotesSum.rows);
    }catch (err){
        console.log(err);
        res.status(500).send("An error occurred while getting the sums of notes");
    }
}*/

const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await studentModel.getStudentById(id);
        if (student) {
            res.status(200).json({ user: student })
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (err) {
        console.error('Error fetching student by ID:', err);
        res.status(500).json({ message: 'Error fetching student by ID', error: err.message });
    }
};

const getLessons = async (req, res) => {
    try {
        const getLessons = await studentModel.getLessons();
        res.status(200).json(getLessons.rows);
    }catch (err){
        console.log(err);
        res.status(500).send("An error occurred while getting the lessons");
    }
}

const getAbsenteeism = async (req, res) => {
    try {
        const id = req.user.id;
        const absenteeismRecords = await studentModel.getAbsenteeism(id);
        res.status(200).json(absenteeismRecords.rows);
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred while getting absenteeism records");
    }
};

const getSchedule = async (req, res) => {
    try {
        const id = req.user.id
        const getSchedule = await studentModel.getSchedule(id);
        res.status(200).json(getSchedule.rows);
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred while getting the schedule");
    }
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