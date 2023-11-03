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

const corsOptions = { 'Access-Control-Allow-Origin': '*'};
app.use(cors(corsOptions));

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

//CREATE a User
app.post("/api/addUser/",(req,res)=> {
    const newUser = req.body;
    //Validation for the user input
    // add new user query
    console.log(newUser);
    pool.query('INSERT INTO users SET ?',{
        user_firstName :newUser.firstName,
        user_lastName : newUser.lastName,
        user_email : newUser.email,
        user_password : newUser.password,
        user_phoneNumber : newUser.phoneNumber,
        user_dob : newUser.dob,
        colleges_college_id:1,
        location_location_id:1,
        campuses_campus_id:1

    }, (err, result) => {
        if (err) throw err;
        res.send("New User Added Successfully!");
    });
        
})

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

// //CREATE House
// app.post("/api/addhouse/",(req,res)=> {

//     const owner = req.body.city;
//     const house_number = req.body.country;
//     const street = req.body.country;
//     const postal_code = req.body.country;
//     const  = req.body.country;

//     // console.log(location);
//     pool.query('INSERT INTO location SET ?',{
//         location_city :location_city,
//         location_country : location_country,

//     }, (err, result) => {
//         if (err) throw err;
//         res.send("Location Added Successfully!");
//     });
        
// })

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


//GET Locations
app.get('/api/location',(req,res)=>{

    pool.query(`SELECT * FROM locations` ,(err,result)=>{
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

//POST Location
app.post("/api/addLocation/",(req,res)=> {

    const location_city = req.body.city;
    const location_country = req.body.country;

    pool.query('INSERT INTO location SET ?',{
        location_city :location_city,
        location_country : location_country,

    }, (err, result) => {
        if (err) throw err;
        res.send("Location Added Successfully!");
    });
        
})


//DELETE Locations
app.delete('/api/location?:locationId', (req,res)=>{
    pool.query('DELETE FROM location Where location_id=?',[req.body.id],
    function(err,results){
        if(err) throw err;
        console.log(`${req.body.id} DELETED`);    
        return res.status(200).json({message:"Location Deleted"});
        });
});

//GET colleges
app.get('/api/colleges',(req,res)=>{

    pool.query(`SELECT * FROM admin` ,(err,result)=>{
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

//POST Colleges
app.post("/api/addCollege/",(req,res)=> {

    const name = req.body.collegeName;

    // console.log(location);
    pool.query('INSERT INTO colleges SET ?',{
        college_name :name,

    }, (err, result) => {
        if (err) throw err;
        res.send("College Added Successfully!");
    });
        
})
//DELETE Colleges
app.delete('/api/colleges?:collegeId', (req,res)=>{
    pool.query('DELETE FROM colleges Where college_id=?',[req.body.id],
    function(err,results){
        if(err) throw err;
        console.log(`${req.body.id} DELETED`);    
        return res.status(200).json({message:"College Deleted"});
        });
});

//GET campuses
app.get('/api/campuses',(req,res)=>{

    pool.query(`SELECT * FROM campuses` ,(err,result)=>{
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

//POST Campuses
app.post("/api/addCampuses/",(req,res)=> {

    const campusName = req.body.name;
    const collegeId = req.body.collegeId;
    const locationId = req.body.locationId;

    // console.log(location);
    pool.query('INSERT INTO campuses SET ?',{
        campus_name :campusName,
        colleges_college_id : collegeId,
        location_location_id : locationId,

    }, (err, result) => {
        if (err) throw err;
        res.send("Campus Added Successfully!");
    });
        
})

//DELETE Campuses
app.delete('/api/campuses?:campusId', (req,res)=>{
    pool.query('DELETE FROM campuses Where campus_id=?',[req.body.id],
    function(err,results){
        if(err) throw err;
        console.log(`${req.body.id} DELETED`);    
        return res.status(200).json({message:"Campus Deleted"});
        });
});

//GET admin
app.get('/api/admin',(req,res)=>{

    pool.query(`SELECT * FROM admin` ,(err,result)=>{
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

//POST Admin
app.post("/api/addAdmin/",(req,res)=> {

    const user = req.body.user;
    const password = req.body.password;
    const role = req.body.role;

    // console.log(location);
    pool.query('INSERT INTO admin SET ?',{
        admin_user :user,
        admin_password : password,
        admin_role:role

    }, (err, result) => {
        if (err) throw err;
        res.send("Admin Added Successfully!");
    });
        
})
//DELETE Admin
app.delete('/api/admin?:adminId', (req,res)=>{
    pool.query('DELETE FROM admin Where admin_id=?',[req.body.id],
    function(err,results){
        if(err) throw err;
        console.log(`${req.body.id} DELETED`);    
        return res.status(200).json({message:"Admin Deleted"});
        });
});

//GET amenities
app.get('/api/amenities',(req,res)=>{

    pool.query(`SELECT * FROM amenities` ,(err,result)=>{
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
//POST Amentities
app.post("/api/addAmenities/",(req,res)=> {

    const aname = req.body.aname;
    const houseId = req.body.houseId;

    // console.log(location);
    pool.query('INSERT INTO amenities SET ?',{
        amenity_name :aname,
        houses_house_id : houseId,

    }, (err, result) => {
        if (err) throw err;
        res.send("Amenity Added Successfully!");
    });
        
})
//DELETE Amenity by id
app.delete('/api/amenities?:amenityId', (req,res)=>{
    pool.query('DELETE FROM amenities Where amenity_id=?',[req.body.id],
    function(err,results){
        if(err) throw err;
        console.log(`${req.body.id} DELETED`);    
        return res.status(200).json({message:"Amenitiy Deleted"});
        });
});

//DELETE Amenity by house id
app.delete('/api/amenities?:houseId', (req,res)=>{
    pool.query('DELETE FROM amenities Where house_id=?',[req.body.id],
    function(err,results){
        if(err) throw err;
        console.log(`${req.body.id} DELETED`);    
        return res.status(200).json({message:"Amenity Mapping to House Deleted"});
        });
});


//GET rating
app.get('/api/rating',(req,res)=>{

    pool.query(`SELECT * FROM rating` ,(err,result)=>{
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

//DELETE Rating
app.delete('/api/rating?:userId', (req,res)=>{
    pool.query('DELETE FROM rating Where user_id=?',[req.body.id],
    function(err,results){
        if(err) throw err;
        console.log(`${req.body.id} DELETED`);    
        return res.status(200).json({message:"Rating Deleted"});
        });
});

//GET reviews
app.get('/api/reviews',(req,res)=>{

    pool.query(`SELECT * FROM reviews` ,(err,result)=>{
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

//DELETE Reviews
app.delete('/api/review?:userId', (req,res)=>{
    pool.query('DELETE FROM reviews Where user_id=?',[req.body.id],
    function(err,results){
        if(err) throw err;
        console.log(`${req.body.id} DELETED`);    
        return res.status(200).json({message:"Review Deleted"});
        });
});
