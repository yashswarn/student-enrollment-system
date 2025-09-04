const db = require("../config/database");

exports.getStudents = async (req, res) => {
  const { courseId } = req.query;

  try {
    const [sql] = await db.execute(
      `
    select s.name,s.email,e.marks
    from student s
    inner join enrollments e on
    e.student_id=s.student_id
    where e.course_id=?
    `,
      [courseId]
    );

    console.log("data loaded", sql);
    res.json(sql);
  } catch (error) {
    console.error("course id is not found", error);
    return res.status(400).send("server error");
  }

  // const sql = `
  //   select s.name,s.email,e.marks
  //   from student s
  //   inner join enrollments e on
  //   e.student_id=s.student_id
  //   where e.course_id=?
  //   `;
  // db.query(sql, [courseId], (error, result) => {
  //   if (error) {
  // console.error("course id is not found", error);
  // return res.status(400).send("server error");
  //   }
  //   res.json(result);
  // });
};

// exports.addStudents = async(req, res) => {
//   const { name, email, department, dob, gender, mobile } = req.body;
//   console.log("req body is->", req.body);

//   await db.getConnection((error, connection) => {
//     if (error) {
//       console.error("connection error", error);
//       return res.status
//         (500)
//         .json({ message: "database connection faild", error: error });
//     } else {
//       await connection.beginTransaction((error)=>{
//         if(error){
//           connection.release();
//           return res.status(500).json({message:"Transaction start failed ho gya h",error:error})
//         }
//       })
//       try {
//         // if email already exist
//         const [checkEmail] = await db.execute("select *from student where Email=?",[email]);
//         connection.query(checkEmail, [email], (error, result) => {
//           if (error) {
//             return connection.rollback(() => {
//               connection.release();
//               return res.status(500).json({ message: "Email check failed", error });
//             });
//           }
//           if (result.length > 0) {
//             return connection.rollback(() => {
//               connection.release();
//               return res.status(409).json({ message: "Email already exist" });
//             });
//           } else {
//             const insertQuery = `insert into student (Name
//         ,Email
//         ,Department_id,Date_of_Birth,Gender,Mobile_number)
//         values(?,?,?,?,?,?)`;
//             connection.query(
//               insertQuery,
//               [name, email, department, dob, gender, mobile],
//               // lamda function for handling success and failure
//               (error, result) => {
//                 if (error) {
//                   return connection.rollback(() => {
//                     connection.release();

//                   return res
//                     .status(500)
//                     .json({ message: "failed to insert student", error })
//                   });

//                 } else {
//                   connection.commit((error)=>{
//                     if(error){
//                      return connection.rollback(()=>{
//                         connection.release();
//                      return   res.status(500).json({message:"commit failed",error:error})
//                       })
//                     }
//                     else{
//                       connection.release();
//                     return  res.status(200).json({message:"student added successfully!1"})
//                     }
//                   })
//                 }
//               }
//             );
//           }
//         });
//       } catch (err) {
//         connection.rollback(()=>{
//           connection.release();
//           res.status(500).json({message:"unexpected error",error:err})
//         })
//       }
//     }
//   });
// };

exports.addStudents = async (req, res) => {
  const { name, email, department, dob, gender, mobile } = req.body;
  console.log("req body is->", req.body);

  let connection;

  try {
    // Get a connection from pool
    connection = await db.getConnection();

    // Start transaction
    await connection.beginTransaction();

    // Check if email already exists
    const [existingEmail] = await connection.execute(
      "SELECT * FROM student WHERE Email = ?",
      [email]
    );

    if (existingEmail.length > 0) {
      await connection.rollback();
      return res.status(409).json({ message: "Email already exists" });
    }

    // Insert student
    const insertQuery = `
      INSERT INTO student 
        (Name, Email, Department_id, Date_of_Birth, Gender, Mobile_number) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await connection.execute(insertQuery, [
      name,
      email,
      department,
      dob,
      gender,
      mobile,
    ]);

    // Commit transaction
    await connection.commit();
    return res.status(200).json({ message: "Student added successfully!" });
  } catch (error) {
    // Rollback if any error occurs
    if (connection) await connection.rollback();
    console.error("Error while adding student:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  } finally {
    // Release the connection
    if (connection) connection.release();
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const [sql] = await db.execute("select *from student");
    console.log("all students data is such like that at bcknd->", sql);
    res.json(sql);
  } catch (error) {
    res.status(400).send("query error");
  }

  // db.query(sql, (err, result) => {
  //   if (err) {
  //     res.status(400).send("query error");
  //   } else {
  // console.log("all students data is such like that->", result);
  // res.json(result);
  //   }
  // });
};

exports.getStudentsOfDept = async (req, res) => {
  const departmentId = req.query.departmentId;
  const courseId = req.query.courseId;
  console.log("request body is->", req.query);
  console.log("deparmentId is->", departmentId);
  console.log("courseId is->", courseId);

  try {
    const [sql] = await db.execute(
      `select s.student_id,s.name,s.email,s.Mobile_number
  from student s 
  left join enrollments e on
  s.Student_id=e.student_id and e.course_id=?
  where s.Department_id=? and e.course_id is null`,
      [courseId, departmentId]
    );

    console.log(
      "all students data who are not enrolled in selected course is->",
      sql
    );
    res.json(sql);
  } catch (error) {
    res.status(400).send("query error");
  }
  // const sql = `select s.student_id,s.name,s.email,s.Mobile_number
  // from student s
  // left join enrollments e on
  // s.Student_id=e.student_id and e.course_id=?
  // where s.Department_id=? and e.course_id is null`;

  // db.query(sql, [courseId, departmentId], (error, result) => {
  //   if (error) {
  //     res.status(400).send("query error");
  //   } else {
  // console.log(
  //   "all students data who are not enrolled in selected course is->",
  //   result
  // );
  // res.json(result);
  //   }
  // });
};

exports.getStudentsOfCourse = async (req, res) => {
  const departmentId = req.query.departmentId;
  const courseId = req.query.courseId;
  console.log("request body is->", req.query);
  console.log("deparmentId is->", departmentId);
  console.log("courseId is->", courseId);

  try {
    const [sql] = await db.execute(
      `select s.student_id,s.name,s.department_id,s.email,s.Mobile_number,e.marks
  from student s 
  left join enrollments e on
  s.Student_id=e.student_id and e.course_id=?
  where s.Department_id=? and e.marks is null`,
      [courseId, departmentId]
    );
    console.log(
      "all students data who are not enrolled in selected course is->",
      sql
    );
    res.json(sql);
  } catch (error) {
    res.status(400).send("query error");
  }
  // const sql = `select s.student_id,s.name,s.department_id,s.email,s.Mobile_number,e.marks
  // from student s
  // left join enrollments e on
  // s.Student_id=e.student_id and e.course_id=?
  // where s.Department_id=? and e.marks is null`;

  // db.query(sql, [courseId, departmentId], (error, result) => {
  //   if (error) {
  // res.status(400).send("query error");
  //   } else {
  // console.log(
  //   "all students data who are not enrolled in selected course is->",
  //   result
  // );
  // res.json(result);
  //   }
  // });
};

exports.getCount = async (req, res) => {
  try {
    const [sql] = await db.execute(
      "select count(*) as total_students from student"
    );
    console.log(sql);
    res.json(sql);
  } catch (error) {
    res.status(400).send("query error");
  }
};

exports.getSearchedName = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const searchName = req.query.searchedName || "";

  const offset = (page - 1) * limit;
  console.log("req query is", req.query);

  console.log("searched name at backnd side is:", searchName);

  try {
    // 1. Get filtered students with LIMIT & OFFSET
    const [sql] = await db.execute(
      `select * from student where name like ? limit ${limit} offset ${offset}`,
      [`%${searchName}%`]
    );
    console.log("the student with name is ", sql);

    // 2. Get total count for pagination
    const [totalStudents] = await db.execute(
      `select count(*) as total from student where name like ?`,
      [`%${searchName}%`]
    );

    const totalRecords = totalStudents[0].total;
    const totalPages = Math.ceil(totalRecords / limit);

    res.json({
      // totalStudents,
      totalPages,
      currentPage: page,
      students: sql,
    });
  } catch (err) {
    console.error("query error", err);
    res.status(400).json({ message: "query error", error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  const studentId = req.params.Student_id;
  console.log("req body is->", req.body);
  console.log("req query is->", req.query);
  console.log("req params is->", req.params);

  console.log("student id at backend is ->", studentId);
  try {
    await db.execute(`delete from enrollments where student_id=?`, [studentId]);
    await db.execute(`delete from student where Student_id=?`, [studentId]);

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("query error", error);
    res.status(400).send({ message: "query error", err: error.message });
  }
};

exports.getStudentById = async (req, res) => {
  const studentId = req.params.studentId;
  console.log("student id at backend is->", studentId);

  try {
    const [sql] = await db.execute(
      `SELECT 
      name, 
    email, 
  department_id as department, 
  mobile_number AS mobile, 
  gender AS gender, 
  date_of_birth AS dob,
  student_id
FROM student WHERE student_id = ?
`,
      [studentId]
    );
    res.json(sql[0]);
  } catch (err) {
    console.error("query error");
    res.status(500).json({ message: "server error", error: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  const { name, email, department, dob, gender, mobile } = req.body;
  const studentId = req.params.studentId;
  console.log("student Id is at update student is->", studentId);

  console.log("req body is->", req.body);

  let connection;

  try {
    // Get a connection from pool
    connection = await db.getConnection();

    // Start transaction
    await connection.beginTransaction();

    // Check if email already exists
    const [existingEmail] = await connection.execute(
      "SELECT * FROM student WHERE Email = ?",
      [email]
    );

    if (existingEmail.length > 0) {
      await connection.rollback();
      return res.status(409).json({ message: "Email already exists" });
    }

    // Insert student
    await connection.execute(
      "update student set Name=?, Email=?, Department_id=?, Date_of_Birth=?, Gender=?, Mobile_number=? where student_id=?",
      [name, email, department, dob, gender, mobile, studentId]
    );

    // await connection.execute(updateQuery, [
    //   name,
    //   email,
    //   department,
    //   dob,
    //   gender,
    //   mobile,
    // ]);

    // Commit transaction
    await connection.commit();
    return res.status(200).json({ message: "Student updated successfully!" });
  } catch (error) {
    // Rollback if any error occurs
    if (connection) await connection.rollback();
    console.error("Error while updating student:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  } finally {
    // Release the connection
    if (connection) connection.release();
  }
};
