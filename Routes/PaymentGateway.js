const express = require('express');
const PaymentGatewayController = require('../Controllers/PayementGatewayController');
const router = express.Router();

const AuthenticateUser = require('../Middlewares/AuthenticateUser')

router.post('/order',AuthenticateUser,PaymentGatewayController.order);
router.post('/order/validate',AuthenticateUser,PaymentGatewayController.order_validate);
router.post('/updateCoins',AuthenticateUser,PaymentGatewayController.updateCoins);

module.exports = router;