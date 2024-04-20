const express = require('express');
const homeController = require('../Controllers/homeController');
const router = express.Router();

const AuthenticateUser = require('../Middlewares/AuthenticateUser')

router.post('/getdetails', AuthenticateUser , homeController.getdetails);
router.post('/uploaditems', AuthenticateUser , homeController.uploaditems);
router.post('/getUpcoming', AuthenticateUser , homeController.getUpcoming);
router.post('/getItemsDetails',AuthenticateUser,homeController.getItemsDetails);
router.post('/fetchBiddingItem',AuthenticateUser,homeController.fetchBiddingItem);

module.exports = router;