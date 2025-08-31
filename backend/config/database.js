// this file connect db to backend

const mysql=require("mysql2/promise");
require('dotenv').config();

const db=mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0
})

db.getConnection((err)=>{
    if(err){
        console.error("mysql connection failed",err)
        return ;
    }
    else{
        console.log("mysql connect ho gya h backend se");
    }
})

module.exports=db;