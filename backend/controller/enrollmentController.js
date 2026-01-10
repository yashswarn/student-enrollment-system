const db = require("../config/database");

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

exports.CoursePopularity = async (req, res) => {
  try {
    const [sql] = await db.execute(
      "select c.course_name, count(e.course_id) as count from courses c left join enrollments e on e.course_id=c.course_id group by c.course_name order by count desc"
    );
    console.log("data on backend is->", sql);
    res.json(sql);
  } catch (err) {
    res.status(400).send("query eror");
  }
};
