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
app.get ("/api/users/", (req,res)=>{
    pool.query(`SELECT * FROM users `,(err,result)=>{
        if (!err ) 
        {
            return res.status(200).json({data:result});
        }
        else{
            console.log(result);
            return res.status(404).json({message:'No Data'});
        }
        })
})

//GET users by id
app.post("/api/user?:id" , (req,res)=>{
    pool.query(`SELECT * FROM users where user_id= ? `,[req.body.id],(err,result)=>{
        if (!err ) 
        {
            return res.status(200).json({data:result});
        }
        else{
            console.log(result);
            return res.status(404).json({message:'User Not Found'});
        }
    })
});

// //CREATE a User
// app.post("api/addUser",(req,res)=> {
//     const newUser = req.body;
//     createUser(null, newUser).then((savedUSer) => {
//         res.json(savedUSer);
//       }).catch((error) => {
//         res.status(500).json({ success: false, message: 'Failed to insert user' });
//       });
// })

//UPDATE a User
app.put("/api/user?:id", (req, res) => {
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
app.delete('/api/user?:userId', (req,res)=>{
    pool.query('DELETE FROM users Where user_id=?',[req.body.id],
    function(err,results){
        if(err) throw err;
        console.log(`${req.body.id} DELETED`);    
        return res.status(200).json({message:"User Deleted"});
        });
});

//GET All HOUSES
app.get ("/api/houses/", (req,res)=>{

    pool.query(`SELECT * FROM houses` ,(err,result)=>{
        if (!err ) 
        {
            return res.status(200).json({data:result});
            
        }
        else{
            console.log(result);
            return res.status(404).json({message:'No Data'});

        }
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
    const hashedPassword = bcrypt.hash(req.body.password,"salt", (err, hash) => { });
    const fname=req.body.firstName;
    const lname=req.body.lastName;
    const phone= req.body.phoneNumber;
    const dob= req.body.dob;
    const email=req.body.email;
    const clg = req.body.college;
    const location=req.body.location;
    const campus=req.body.campus;

    console.log(req.body,hashedPassword);
    // //insert into pool query
    // pool.query(`INSERT INTO users (user_firstName,user_lastName,user_phoneNumber,user_dob,user_email,user_password,colleges_college_id,location_location_id,campuses_campus_id) VALUES(`,[{ 
    //     fname,
    //     lname,
    //     phone,
    //     dob,
    //     email,
    //     hashedPassword,
    //     clg,
    //     location,
    //     campus
    //     }], (error, results, fields) =>{

    //         if (error) throw error;
    //         console.log('User CReated Successfully');

    //     });

    pool.query(`INSERT INTO users SET ?`,[{ 
            user_firstName:fname,
            user_lastName:lname,
            user_phoneNumber:phone,
            user_dob:dob,
            user_email:email,
            user_password:req.body.password,
            colleges_college_id:clg,
            location_location_id:location,
            campuses_campus_id:campus
            }], (error, results, fields) =>{
    
                if (error) throw error;
                return res.status(301).json({message:"Created User"});
    
            });
    

})



