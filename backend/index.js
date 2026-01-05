// this is our main file

const express = require("express");
const path=require("path");
const cors = require("cors");
const dotenv=require('dotenv');
const bodyParser = require("body-parser");
// const mysql = require("mysql2");
const departmentRoutes=require('./routes/departmentRoutes');
const courseRoutes=require('./routes/courseRoutes')
const studentRoutes=require('./routes/studentRoutes');
const enrollmentRoutes=require('./routes/enrollmentRoutes')
const loginRoutes=require('./routes/loginRoutes')
const registerRoutes=require('./routes/registerRoutes')
const db=require('./config/database')
dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


app.use(express.json())
// app.use(bodyParser.json());

app.use('/departments',departmentRoutes)
app.use('/courses',courseRoutes)
app.use('/students',studentRoutes);
app.use('/enrollments',enrollmentRoutes)
app.use('/login',loginRoutes);
app.use('/register',registerRoutes)

app.get('/health', (req, res) => res.json({ ok: true }));
app.get('/', (req, res) => {
  res.send('Backend is running successfully!');
});


const PORT = process.env.PORT || 4000


app.listen(PORT, () => {
  console.log(`server started at port no ${PORT}`);
});
