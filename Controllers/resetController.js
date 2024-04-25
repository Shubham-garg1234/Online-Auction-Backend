const validator = require('validator')
const User = require('../Models/userModel')
const crypto = require('crypto')
const mailSender = require('../Utils/MailSender')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const otpGenerator = require('otp-generator')
const OTP = require('../Models/otpModel')


exports.forgotPass = async (req, res) => {
    let success = false;
    try{  
        const { email } = req.body;
        if(!validator.isEmail(email)){
          return res.status(403).json({success , error: "Invalid Email"})
        }
    
        // Check if user is already present
        const user = await User.findOne({ email });
        
        if (!user) {
          return res.status(404).json({success , error: 'User not found'});
        }
  
        let otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
        });
      
        let result = await OTP.findOne({ otp: otp });
        while (result) {
          otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
          });
          result = await OTP.findOne({ otp: otp });
        }
      
        const otpPayload = { email, otp };
        await OTP.create(otpPayload);
        success = true
        res.status(200).json({success , message: 'OTP Sent Successfully' });
  
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success , error: error.message });
    }  
};


exports.verifyOtp = async(req , res) => {
    let success = false
    try{
       const { email , otp } = req.body;

        if ( !email || !otp ) {
            success = false
            return res.status(403).json({success , error: "Please provide all the fields"})
        }

         // Check if all details are provided
        if(!validator.isEmail(email)){
            return res.status(403).json({success , error: "Invalid Email"})
        }
        
        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        if (response.length === 0 || otp !== response[0].otp) {
            success = false
            return res.status(400).json({success , error: "The OTP is not valid"})
        }

        success = true;
        res.status(200).json({success , message: "OTP verified successfully"})
    }
    catch(error){
        console.error(error)
        return res.status(400).json({success , error: "Error while verifying otp"})
    }
}



exports.resetPass = async (req, res) => {
    let success = false;
    try {
        const { email, pwd } = req.body;

        if ( !email || !pwd ) {
            success = false
            return res.status(403).json({success , error: "All fields are required"})
        }

        // Check if all details are provided
        if(!validator.isEmail(email)){
            return res.status(403).json({success , error: "Invalid Email"})
        }

        const user = await User.findOne({ email: email });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pwd, salt);

        user.password = hashedPassword;
        await user.save();

        const data = {
            user:{
                id: user.id
            }
        }

        //Generating a JWT token
        var authToken = jwt.sign(data, "jsbgskb", { expiresIn: '10h' })

        success = true;
        return res.status(200).json({ success, authToken , message: 'Password reset successful' });

    }catch (error) {
        console.error(error);
        return res.status(400).json({ success, error: "Error while reseting the password" });
    }
};