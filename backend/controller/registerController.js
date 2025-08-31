const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");

exports.formSubmit = async (req, res) => {
  const { email, password } = req.body;
  console.log("req body is->", req.body);
  console.log("email is->", email);
  console.log("password is->", password);

  try {
    const [rows] = await db.execute("select *from users where email=?", [
      email,
    ]);
    if (rows.length > 0) {
      return res.status(409).json({ message: "User already registered" });
    }

    // insert hash password 
    const saltRounds=10;
    const hashedPassword=await bcrypt.hash(password,saltRounds);

    
    // success
      const [sql] = await db.execute( "insert into users(email,password_hash) values(?,?)",
        [email,hashedPassword]
      );
      
          const token = jwt.sign(
            { id: sql.insertId, email },
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
          );
          return res
            .status(201)
            .json({ message: "Register Successful", user: {id:sql.insertId,email},token, });
        }
  catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error",error:err.message});
  }
};
