const express = require("express");
const pool = require("./db.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
var mysql = require('mysql');
const bcrypt = require('bcrypt');

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
    conn.query(`SELECT * FROM users where user_id=${req.params.id}`,function(err,result){
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
    const user_id = req.params.id;
    const userData = req.body;
    updateUser(null, { user_id, userData })
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
    conn.query('DELETE FROM users Where user_id=?',[req.params.userId],
    function(err,results){
        if(err) throw err;
        console.log(`${req.params.user_id} DELETED`);    
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
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body);
        pool.query(`SELECT * FROM users where user_email= ?`,[email],(err,result,fields)=>{
            if (!err ) 
            {
                console.log(result, password,result[0].user_password);
                try{
                    if(password == result[0].user_password){
                        console.log("Password Matched");
                        return res.status(200).json({message:"Successfully Logged In"});
                        
                    }
                    else{
                        //Password Not Matched
                        console.log("Password UNMatched");
                        return res.status(403).json({message:'Invalid Credentials'});
                        
                    }
                }
                catch(err){
                    res.redirect("/signup");
                    };  
            }        
                                
        });
})

//Register
app.post('/api/register', (req,res)=>{
    const hashedPassword = bcryptjs.hashSync(req.body.password, 8);
})



