const userSchema = new SchemaManager({

    firstName,
    lastName,
    phoneNumber,
    dob,
    email,
    password,
    image,
    collegeId,
    locationId,
    campusId
    
});

const userModel = mongoose.model('Users',userSchema);
module.exports=userModel;