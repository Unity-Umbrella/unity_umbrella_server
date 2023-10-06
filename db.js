const mysql = require('mysql');

const conn = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"unity_umbrella"

});

conn.connect((error) =>{
    if (error) throw error;
    console.log("Connected to the Mysql Server");
});

module.exports= {conn}