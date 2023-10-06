const express = require("express");
const conn = require("./db.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mysql = require('mysql');

const app= express();

//Enhance security to the RestAPI'security
app.use(helmet());

app.use(bodyParser.json());

app.use(cors());

app.use(morgan('combined'));

app.listen(3001,()=>{
    console.log("###Listening on Port 3001");
});

//GET all Users
app.get("api/users",(req,res) =>{
    conn.query(`SELECT * FROM users`,function(err ,rows){
        if(!err) res.send({data: rows}) ; else return err;
        })
})

//GET users by id
app.post("/api/user/:id" , (req,res)=>{
    conn.query(`SELECT * FROM users where userId=${req.params.id}`,function(err,result){
        if (!err ) response.send ({ data : result} );else{return err;}
    })}
);

//CREATE a User
app.post("api/addUser",(req,res)=> {
    const newUser = req.body;
    createUser(null, newUser).then((savedUSer) => {
        res.json(savedUSer);
      }).catch((error) => {
        res.status(500).json({ success: false, message: 'Failed to insert user' });
      });
})

//UPDATE a User
app.put("/api/user/:id", (req, res) => {
    const userId = req.params.id;
    const userData = req.body;
    updateEmployee(null, { userId, userData })
      .then((user) => {
        res.json({
          updatedUser: user,
        }).status(200);
      })
      .catch((err) => {
        res.json({
            updatedUser: null,
          message: "Something went wrong while updating the User.",
        }).status(500);
      });
  });

//DELETE User
app.delete('/api/user/:userId', (req,res)=>{
    conn.query('DELETE FROM users Where UserId=?',[req.params.userId],
    function(err,results){
        if(err) throw err;
        console.log(`${req.params.userId} DELETEd`);    
        });
});

//GET All HOUSES
app.get ("/api/houses/", (req,res)=>{
    conn.query ('SELECT * FROM houses;',
    function(err, results ){
        if(!err && results != undefined || !results == []) return  res.send({"data":results,"message":"success"});
        else if(!err) return res.send({"data":results}).status(201);
        else console.log (`Error ${err}`);
        })
    })

//Login
app.post('/api/login', (req,res) =>{

})

//Register
app.post('/api/register', (req,res)=>{})



