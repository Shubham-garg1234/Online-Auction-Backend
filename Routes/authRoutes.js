
//importing express
const express = require('express')

//creating a express router by express.Router()
const router = express.Router()

//fetching the user details from the middleware
const authenticateUser = require('../Middlewares/AuthenticateUser')

//fetching the controllers for the different api hits
const authController = require('../Controllers/authController');

//Routes
router.post('/signup' , authController.signup);
router.post('/login' , authController.login)
router.post('/getUser' , authenticateUser  , authController.getUser)
router.post('/logout' , authenticateUser)

//exporting router
module.exports = router


