const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.formSubmit = async (req, res) => {
  const { email, password } = req.body;
  console.log("req body is->", req.body);
  console.log("email is->", email);
  console.log("password is->", password);

  try {
    const [rows] = await db.execute("select *from users where email=?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }

    // compare password using bcrypt
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // success
    else {
      // now get roles for the user
      const [roleRows] = await db.execute(
        "select r.role_name from roles r inner join user_role ur on r.id=ur.role_id where ur.id =?",
        [user.id]
      );

      const roles = roleRows.map((role) => role.role_name);
      // const roles = roleRows;
      console.log("roles is->", roles);

      const [courseRows] = await db.execute(
        "select c.course_name from courses c join teacher_course_mapping tcm on c.course_id=tcm.course_id where tcm.user_id=?",[user.id]
      );

      const courseName=courseRows.map((course)=>course.course_name);
      console.log("course name is->",courseName);

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: roles,
          course:courseName,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      console.log("token is->", token);
      const { password_hash, ...safeUser } = user;
      return res.status(200).json({
        message: "Login Successful",
        user_ka: safeUser,
        token: token,
        role: roles,
        course:courseName,
      });
    }
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "server error" });
  }
};
