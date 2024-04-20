const express = require('express');
const LiveAuctionController = require('../Controllers/LiveAuctionController');
const router = express.Router();
const AuthenticateUser = require('../Middlewares/AuthenticateUser')

module.exports = router;