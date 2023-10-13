var mysql = require('mysql');

const {createPool} = require('mysql');


const pool = createPool({
    host:"localhost",
    user:"root",
    password:"root",
    database:"unity_umbrella",
    connectionLimit:100000

});

// conn.connect((error) =>{
//     if (error) throw error;
//     console.log("Connected to the Mysql Server");
// });

module.exports= pool;