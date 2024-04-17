const express = require('express');
const homeController = require('../Controllers/homeController');
const router = express.Router();

const AuthenticateUser = require('../Middlewares/AuthenticateUser')

router.post('/getdetails', AuthenticateUser , homeController.getdetails);

module.exports = router;