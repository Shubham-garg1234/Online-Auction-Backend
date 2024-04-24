require("dotenv").config()

//importing bcrypt
const bcrypt = require('bcrypt')

//importing jsonwebtoken
const jwt = require('jsonwebtoken')

//Using a users schema and otp schema to connect and store data in the database
const User = require('../Models/userModel')
const OTP = require('../Models/otpModel');

const JWT_SECRET = process.env.JWT_SECRET


exports.signup = async (req, res) => {

    //Creating a user in database by the try catch block
    let success;
    try{

        const { otp , email , pwd , username } = req.body;
        // Check if all details are provided
        console.log(otp,email,pwd,username)
        if ( !otp ) {
            success = false
            return res.status(403).json({success , error: "Please enter your OTP"})
        }
        
        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        if (response.length === 0 || otp !== response[0].otp) {
            success = false
            return res.status(400).json({success , error: "The OTP is not valid"})
        }

        //Generating a salt
        const salt = await bcrypt.genSalt(10);

        //Hashing a password
        const secPass = await bcrypt.hash(pwd , salt);

        //Creating a user
        let user = await User.create({
            name: username,
            email: email,
            password: secPass
        })


        //Creating a data object that is to be given to the server for autherozing the user
        const data = {
            user:{
                id: user.id
            }
        }

        //Generating a JWT token
        var authToken = jwt.sign(data, JWT_SECRET ,{ expiresIn: '10h' })

        const userId = user.id

        //giving back response
        success = true
        res.json({success , authToken , userId })
    }
    //Checking for any error so that app does not crash
    catch(err){
        success = false
        console.log(err)
        res.json({success , error: "some error occurred"})
    }
};


exports.login = async (req , res) => {
    let success;
    try{
        const { email , pwd } = req.body;
        // Check if all details are provided
        if ( !email || !pwd ) {
            success = false
            return res.status(403).json({success , error: "All fields are required"})
        }

        //creating a boolean variable to check if the user is already present or not
        let user = await User.findOne({ email });
        
        //if present, show the error message
        if(!user){
            success = false
            return res.status(400).json({success , error: "Please try to login using correct credentials"})
        }
        
        //bcrypt function used to validate the password

        const passwordCompare = await bcrypt.compare(pwd , user.password)
        //if password does not match
        if(!passwordCompare){
            success = false
            return res.status(400).json({success , error: "Please try to login using correct credentials"})
        }

        //Creating a data object that is to be given to the server for autherozing the user
        const data = {
            user:{
                id: user.id
            }
        }
        const userId = user.id

        //Generating a JWT token
        var authToken = jwt.sign(data, JWT_SECRET ,{ expiresIn: '10h' })

        console.log(authToken);
        //giving back response
        success = true
        res.json({success , authToken })

    }
    //Checking for any error so that app does not crash
    catch(err){
        console.log(err)
        success = false
        res.json({success , error: "some error occurred"})
    }
};


exports.getUser = async (req, res) => {
    let success;
    try {
        
        //making a constant varible to store the id of user
        const userId = req.user.id;

        //creating a json object to check if the user is already present or not, it select all the things apart from password
        const user = await User.findById(userId).select("-password");
        
        //if not present, show the error message
        if(!user){
            success = false
            return res.status(400).json({success , error: "Please try to login using correct credentials"})
        }

        //giving the user back in the response
        success = true
        res.status(200).json({success , user})

    } catch (error) {
      console.log(error.message);
      success = false
      return res.status(500).json({success ,  error: error.message });
    }
};