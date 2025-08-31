// this is our main file

const express = require("express");
const path=require("path");
const cors = require("cors");
const dotenv=require('dotenv');
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const departmentRoutes=require('./routes/departmentRoutes');
const courseRoutes=require('./routes/courseRoutes')
const studentRoutes=require('./routes/studentRoutes');
const enrollmentRoutes=require('./routes/enrollmentRoutes')
const loginRoutes=require('./routes/loginRoutes')
const registerRoutes=require('./routes/registerRoutes')
const db=require('./config/database')
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json())
app.use(bodyParser.json());

app.use('/departments',departmentRoutes)
app.use('/courses',courseRoutes)
app.use('/students',studentRoutes);
app.use('/enrollments',enrollmentRoutes)
app.use('/login',loginRoutes);
app.use('/register',registerRoutes)

const PORT = process.env.PORT || 4000

// to host the website

// app.use(express.static(path.join(__dirname,"dist")));

// app.get("*",(req,res)=>{
//   res.sendFile(path.join(__dirname,"dist","index.html"))
// })

// connect backend to database(mysql)


// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Thar@2004",
//   database: "college_management_system",
// });

// // error handling

// db.connect((err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("My sql connected ho gya h");
//   }
// });

// // now mount api
// app.get("/students", (req, res) => {
//   console.log("route called");
//   const { courseId } = req.query;
//   console.log("courseId is->", courseId);

//   const sql = `
//     select s.name,s.email,e.marks
//     from student s 
//     inner join enrollments e on s.student_id=e.student_id
//     WHERE e.course_id=?
//     `;

//   db.query(sql, [courseId], (error, result) => {
//     if (error) {
//       console.error("error while fetching the student record", error);
//       return res.status(500).send("server error");
//     } else {
//       console.log("student fetched", result);
//       res.json(result);
//     }
//   });
// });

// app.get("/departments", (req, res) => {
//   const sql = "select *from departments";

//   db.query(sql, (error, result) => {
//     if (error) {
//       return res.status(500).send("error while fetching departments");
//     } else {
//       res.json(result);
//     }
//   });
// });

// app.get("/courses", async (req, res) => {
//   const { departmentId } = req.query;
//   console.log("departmentId is->", departmentId);

//   if (departmentId) {
//     const sql = "select *from courses WHERE DEPARTMENT_ID =?";
//     db.query(sql, [departmentId], (error, result) => {
//       if (error) {
//         console.error("Error while fetching courses:", error);
//         return res.status(500).json({ error: "Error while fetching courses" });
//       }
//       res.json(result);
//     });
//   }
// });

// now listen

// db.getConnection((err)=>{
//     if(err){
//         console.error("mysql connection failed",err)
//         return ;
//     }
//     else{
//         console.log("mysql connect ho gya h backend se");
//     }
// })

app.listen(PORT, () => {
  console.log("server started at port no 3000");
});
