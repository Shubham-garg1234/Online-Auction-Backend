const express = require('express');
const homeController = require('../Controllers/homeController');
const router = express.Router();

const AuthenticateUser = require('../Middlewares/AuthenticateUser')

router.post('/getdetails', AuthenticateUser , homeController.getdetails);
router.post('/uploaditems', AuthenticateUser , homeController.uploaditems);

module.exports = router;