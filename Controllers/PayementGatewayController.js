const User = require('../Models/userModel')
require('dotenv').config()
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto");
const Transaction = require('../Models/transactionModel')

exports.order= async (req, res) => {
  try {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
      });
  
      const options = req.body;
      const order = await razorpay.orders.create(options);
  
      if (!order) {
        return res.status(500).send("Error");
      }
  
      res.json(order);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error");
    }
  };

  exports.order_validate= async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
  
    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    //order_id + "|" + razorpay_payment_id
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");
    if (digest !== razorpay_signature) {
      return res.status(400).json({ msg: "Transaction is not legit!" });
    }
  
    res.json({
      msg: "success",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  };

  exports.updateCoins=async(req,res)=>{
    try{
    const userId = req.user.id;
    const {addcoins}=req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.coins += addcoins;
    await user.save();
    const transaction = await Transaction.create({
      sellerId: req.user.id,
      amount: addcoins,
      itemName: 'Recharge'
    })
    console.log(transaction)
    await transaction.save()

    return res.status(201).json({ message: "success" })
  }
    catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }