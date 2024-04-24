
//importing express
const express = require('express')

//creating a express router by express.Router()
const router = express.Router()


//fetching the user details from the middleware
const authenticateUser = require('../Middlewares/AuthenticateUser')

//fetching the controllers for the different api hits
const notificationController = require('../Controllers/notificationController');

//Routes
router.get('/fetchNotifications' , authenticateUser , notificationController.fetchNotifications);
router.post('/addNotification' , authenticateUser , notificationController.addNotification);
router.get('/fetchTransactions' , authenticateUser , notificationController.fetchTransactions);

//exporting router
module.exports = router


