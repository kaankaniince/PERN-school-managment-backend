const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./routes/routes');
const dotenv = require('dotenv');

const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// app.use(authMiddleware) ?

// Try app.use('/')
app.use('/', router)
/*
app.use('/admin', adminRouter)
app.use('/student', studentRouter)
app.use('/teacher', teacherRouter)
 */

app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`)
})