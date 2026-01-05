const db = require("../config/database");

exports.getCourses = async (req, res) => {
  const { departmentId } = req.query;

  try {
    const [sql] = await db.execute(
      `select *from courses where DEPARTMENT_ID=?`,
      [departmentId]
    );
    res.json(sql);
  } catch (error) {
    console.error("departmentId is missing", error);
    return res.status(400).send("server error");
  }

};

exports.getCourseCount=async(req,res)=>{
  try{
    const [sql]=await db.execute('select count(*) as total_courses from courses');
    res.json(sql);
    console.log('total courses are->',sql); 
  }
  catch(error){
    res.status(400).send('query error');
  }
}

exports.getActiveEnrollments=async(req,res)=>{
  try{
    const [sql]=await db.execute('select distinct count(student_id) as active_enrollments from enrollments where course_id is not null');
    res.json(sql);
    console.log('active enrollments are->',sql); 
  }
  catch(error){
    res.status(400).send('query error');
  }
}
