// this file consists business logic

const db = require("../config/database");

exports.getDepartments = async (req, res) => {
  try {
    const [sql] = await db.execute("select *from departments");
    console.log("departments loaded by backend are->", sql);
    res.json(sql);
  } catch (error) {
    console.error("db error", error);
    return res.status(400).send("server error");
  }
};
