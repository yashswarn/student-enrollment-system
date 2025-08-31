// const db = require("../config/database");

// exports.studentEnrollment = (req, res) => {
//   const { courseId, studentIds } = req.body;
//   console.log("req body is->", req.body);
//   console.log("course is at backend is->", courseId);
//   console.log("student ids at backend are->", studentIds);

//   db.getConnection((error, connection) => {
//     if (error) {
//       console.error("connnection error", error);
//       return res
//         .status(500)
//         .json({ message: "database connection failed", error: error });
//     } else {
//       connection.beginTransaction((error) => {
//         if (error) {
//           connection.release();
//           return res
//             .status(500)
//             .json({ message: "transactoin failed", error: error });
//         }
//         try {
//           let errorOccurred = false;
//           let successCnt = 0;

//           studentIds.forEach((studentId) => {
//             if (errorOccurred) {
//               return;
//             }

//             // if student with the course  already exist
//             const checkStudentId = `select *from enrollments where student_id=? and course_id=?`;
//             connection.query(
//               checkStudentId,
//               [studentId, courseId],
//               (error, result) => {
//                 if (error) {
//                   errorOccurred = true;
//                   return connection.rollback(() => {
//                     connection.release();
//                     return res
//                       .status(500)
//                       .json({ message: "studentId check failed", error });
//                   });
//                 }
//                 if (result.length > 0) {
//                   errorOccurred = true;
//                   return connection.rollback(() => {
//                     connection.release();
//                     return res.status(409).json({
//                       message: `Studentid ${studentId} already assigned the choosen course ${courseId} `,
//                     });
//                   });
//                 } else {
//                   const insertQuery = `insert into enrollments(student_id,course_id) values(?,?)`;
//                   connection.query(
//                     insertQuery,
//                     [studentId, courseId],
//                     (error, result) => {
//                       if (error && !errorOccurred) {
//                         errorOccurred = true;
//                         return connection.rollback(() => {
//                           connection.release();
//                           return res.status(500).json({
//                             message: "failed to enroll students",
//                             error: error,
//                           });
//                         });
//                       }
//                       successCnt++;

//                       if (successCnt == studentIds.length && !errorOccurred) {
//                         connection.commit((error) => {
//                           if (error) {
//                             return connection.rollback(() => {
//                               connection.release();
//                               return res.status(500).json({
//                                 message: "commit failed",
//                                 error: error,
//                               });
//                             });
//                           } else {
//                             connection.release();
//                             return res
//                               .status(200)
//                               .json({ message: "students enrolled " });
//                           }
//                         });
//                       }
//                     }
//                   );
//                 }
//               }
//             );
//           });
//         } catch (error) {
//           connection.rollback(() => {
//             connection.release();
//             return res
//               .status(500)
//               .json({ message: "unexpected error", error: error });
//           });
//         }
//       });
//     }
//   });
// };

// const db = require("../config/database");

// exports.studentEnrollment = async (req, res) => {
//   const { courseId, studentIds } = req.body;
//   console.log("req body is->", req.body);
//   console.log("course is at backend is->", courseId);
//   console.log("student ids at backend are->", studentIds);

//   db.getConnection(async (error, connection) => {
//     if (error) {
//       console.error("Connection error:", error);
//       return res.status(500).json({ message: "Database connection failed", error });
//     }

//     connection.beginTransaction(async (error) => {
//       if (error) {
//         connection.release();
//         return res.status(500).json({ message: "Transaction failed", error });
//       }

//       try {
//         for (const studentId of studentIds) {
//           const [existing] = await new Promise((resolve, reject) => {
//             const query = `SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?`;
//             connection.query(query, [studentId, courseId], (err, result) => {
//               if (err) return reject(err);
//               resolve(result);
//             });
//           });

//           if (existing) {
//             throw {
//               conflict: true,
//               message: `Student ID ${studentId} already assigned to course ${courseId}`,
//             };
//           }

//           await new Promise((resolve, reject) => {
//             const insertQuery = `INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)`;
//             connection.query(insertQuery, [studentId, courseId], (err, result) => {
//               if (err) return reject(err);
//               resolve(result);
//             });
//           });
//         }

//         connection.commit((err) => {
//           connection.release();
//           if (err) {
//             return res.status(500).json({ message: "Commit failed", error: err });
//           }
//           return res.status(200).json({ message: "Students enrolled successfully" });
//         });

//       } catch (err) {
//         connection.rollback(() => {
//           connection.release();
//           if (err.conflict) {
//             return res.status(409).json({ message: err.message });
//           }
//           return res.status(500).json({ message: "Enrollment failed", error: err });
//         });
//       }
//     });
//   });
// };

const db = require("../config/database");

// exports.studentEnrollment = (req, res) => {
//   const { courseId, studentIds } = req.body;
//   console.log("received at backend:", courseId, studentIds);

//   db.getConnection(async (error, connection) => {
//     if (error) {
//       console.error("Connection error:", error);
//       return res
//         .status(500)
//         .json({ message: "Database connection failed", error });
//     }

//     connection.beginTransaction(async (error) => {
//       if (error) {
//         connection.release();
//         return res.status(500).json({ message: "Transaction failed", error });
//       }

//       try {
//         for (const studentId of studentIds) {
//           // Check if already enrolled
//           const existing = await new Promise((resolve, reject) => {
//             const query = `SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?`;
//             connection.query(query, [studentId, courseId], (err, result) => {
//               if (err) return reject(err);
//               resolve(result);
//             });
//           });

//           if (existing.length > 0) {
//             throw {
//               conflict: true,
//               message: `Student ID ${studentId} is already enrolled in course ${courseId}`,
//             };
//           }

//           // Enroll student
//           await new Promise((resolve, reject) => {
//             const insertQuery = `INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)`;
//             connection.query(
//               insertQuery,
//               [studentId, courseId],
//               (err, result) => {
//                 if (err) return reject(err);
//                 resolve(result);
//               }
//             );
//           });
//         }

//         // Commit if all successful
//         connection.commit((err) => {
//           connection.release();
//           if (err) {
//             return res
//               .status(500)
//               .json({ message: "Commit failed", error: err });
//           }
//           return res
//             .status(200)
//             .json({ message: "Students enrolled successfully" });
//         });
//       } catch (err) {
//         connection.rollback(() => {
//           connection.release();
//           if (err.conflict) {
//             return res.status(409).json({ message: err.message });
//           }
//           return res
//             .status(500)
//             .json({ message: "Enrollment failed", error: err });
//         });
//       }
//     });
//   });
// };

// exports.studentMarks = (req, res) => {
//   const { students, courseId } = req.body;
//   console.log("received studentids and marks at backend:", students);
//   console.log("received courseId at backend:", courseId);

//   db.getConnection(async (error, connection) => {
//     if (error) {
//       console.error("Connection error:", error);
//       return res
//         .status(500)
//         .json({ message: "Database connection failed", error });
//     }

//     connection.beginTransaction(async (error) => {
//       if (error) {
//         connection.release();
//         return res.status(500).json({ message: "Transaction failed", error });
//       }

//       try {
//         for (const student of students) {
//           const studentId = student.studentId;
//           const marks = student.marks;

//           // Check if already enrolled
//           const existing = await new Promise((resolve, reject) => {
//             const query = `SELECT * FROM enrollments WHERE student_id = ? AND course_id = ? `;
//             connection.query(query, [studentId, courseId], (err, result) => {
//               if (err) return reject(err);
//               resolve(result);
//             });
//           });

//           if (existing.length > 0) {
//             // check if marks already assign
//             if (existing[0].marks != null) {
//               throw {
//                 conflict: true,
//                 message: `Student ID ${studentId} is already assigned marks in course ${courseId}`,
//               };
//             }
//           }

//           // update marks
//           await new Promise((resolve, reject) => {
//             const insertQuery = `update enrollments set marks=? where student_id=? and course_id=?`;
//             connection.query(
//               insertQuery,
//               [marks, studentId, courseId],
//               (err, result) => {
//                 if (err) return reject(err);
//                 resolve(result);
//               }
//             );
//           });
//         }

//         // insert new enrolment with marks

//         // Commit if all successful
//         connection.commit((err) => {
//           connection.release();
//           if (err) {
//             return res
//               .status(500)
//               .json({ message: "Commit failed", error: err });
//           }
//           return res
//             .status(200)
//             .json({ message: "Students enrolled successfully" });
//         });
//       } catch (err) {
//         connection.rollback(() => {
//           connection.release();
//           if (err.conflict) {
//             return res.status(409).json({ message: err.message });
//           }
//           return res
//             .status(500)
//             .json({ message: "Enrollment failed", error: err });
//         });
//       }
//     });
//   });
// };

exports.studentEnrollment = async (req, res) => {
  const { courseId, studentIds } = req.body;
  console.log("received at backend:", courseId, studentIds);

  let connection;

  try {
    // Get connection from pool
    connection = await db.getConnection();

    // Start transaction
    await connection.beginTransaction();

    for (const studentId of studentIds) {
      // 1. Check if already enrolled
      const [existing] = await connection.execute(
        `SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?`,
        [studentId, courseId]
      );

      if (existing.length > 0) {
        // Rollback & conflict response
        await connection.rollback();
        connection.release();
        return res.status(409).json({
          message: `Student ID ${studentId} is already enrolled in course ${courseId}`,
        });
      }

      // 2. Enroll student
      await connection.execute(
        `INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)`,
        [studentId, courseId]
      );
    }

    // 3. Commit if all enrollments succeed
    await connection.commit();
    connection.release();
    return res.status(200).json({ message: "Students enrolled successfully" });
  } catch (err) {
    // Rollback if any error occurs
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error("Enrollment error:", err);
    return res.status(500).json({ message: "Enrollment failed", error: err });
  }
};

// exports.studentMarks = (req, res) => {
//   const { students, courseId } = req.body;
//   console.log("Received student IDs and marks at backend:", students);
//   console.log("Received courseId at backend:", courseId);

//   db.getConnection(async (error, connection) => {
//     if (error) {
//       console.error("Connection error:", error);
//       return res.status(500).json({ message: "Database connection failed", error });
//     }

//     connection.beginTransaction(async (error) => {
//       if (error) {
//         connection.release();
//         return res.status(500).json({ message: "Transaction failed", error });
//       }

//       try {
//         for (const student of students) {
//           const studentId = student.studentId;
//           const marks = student.marks;

//           // Check if enrollment exists
//           const existing = await new Promise((resolve, reject) => {
//             const checkQuery = `SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?`;
//             connection.query(checkQuery, [studentId, courseId], (err, result) => {
//               if (err) return reject(err);
//               resolve(result);
//             });
//           });

//           if (existing.length > 0) {
//             // Check if marks already assigned
//             if (existing[0].marks !== null) {
//               throw {
//                 conflict: true,
//                 message: `Student ID ${studentId} is already assigned marks in course ${courseId}`,
//               };
//             }

//             // Update marks
//             await new Promise((resolve, reject) => {
//               const updateQuery = `UPDATE enrollments SET marks = ? WHERE student_id = ? AND course_id = ?`;
//               connection.query(updateQuery, [marks, studentId, courseId], (err, result) => {
//                 if (err) return reject(err);
//                 resolve(result);
//               });
//             });
//           } else {
//             // Insert new enrollment with marks
//             await new Promise((resolve, reject) => {
//               const insertQuery = `INSERT INTO enrollments (student_id, course_id, marks) VALUES (?, ?, ?)`;
//               connection.query(insertQuery, [studentId, courseId, marks], (err, result) => {
//                 if (err) return reject(err);
//                 resolve(result);
//               });
//             });
//           }
//         }

//         connection.commit((err) => {
//           connection.release();
//           if (err) {
//             return res.status(500).json({ message: "Commit failed", error: err });
//           }
//           return res.status(200).json({ message: "Student marks assigned successfully" });
//         });

//       } catch (err) {
//         connection.rollback(() => {
//           connection.release();
//           if (err.conflict) {
//             return res.status(409).json({ message: err.message });
//           }
//           return res.status(500).json({ message: "Mark assignment failed", error: err });
//         });
//       }
//     });
//   });
// };

exports.studentMarks = async (req, res) => {
  const { students, courseId } = req.body;
  console.log("Received student IDs and marks at backend:", students);
  console.log("Received courseId at backend:", courseId);

  let connection;

  try {
    // 1. Get DB connection from pool
    connection = await db.getConnection();

    // 2. Start transaction
    await connection.beginTransaction();

    for (const student of students) {
      const studentId = student.studentId;
      const marks = student.marks;

      // 3. Check if student is already enrolled
      const [existing] = await connection.execute(
        `SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?`,
        [studentId, courseId]
      );

      if (existing.length > 0) {
        // 4. Check if marks already exist
        if (existing[0].marks !== null) {
          // Marks already assigned
          await connection.rollback();
          connection.release();
          return res.status(409).json({
            message: `Student ID ${studentId} already has marks in course ${courseId}`,
          });
        }

        // 5. Update marks
        await connection.execute(
          `UPDATE enrollments SET marks = ? WHERE student_id = ? AND course_id = ?`,
          [marks, studentId, courseId]
        );
      } else {
        // 6. Insert new enrollment with marks
        await connection.execute(
          `INSERT INTO enrollments (student_id, course_id, marks) VALUES (?, ?, ?)`,
          [studentId, courseId, marks]
        );
      }
    }

    // 7. Commit transaction
    await connection.commit();
    connection.release();
    return res.status(200).json({
      message: "Student marks assigned successfully",
    });
  } catch (err) {
    // 8. Rollback on error
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error("Mark assignment error:", err);
    return res.status(500).json({
      message: "Mark assignment failed",
      error: err,
    });
  }
};

exports.CoursePopularity=async(req,res)=>{
  try{
    const [sql]=await db.execute('select c.course_name, count(e.course_id) as count from courses c left join enrollments e on e.course_id=c.course_id group by c.course_name order by count desc')
    console.log("data on backend is->",sql);
    // res.status(200).send({message:"data fetched on backend side"})
    res.json(sql);
  }
  catch(err){
    res.status(400).send('query eror');
  }
}
