
const Notification = require('../Models/notificationModel')
const Transaction = require('../Models/transactionModel')

exports.addNotification = async (req , res) => {
    let success = false
    try {

        const { message } = req.body
        const notification = await Notification.create({
            user: req.user.id,
            message: message,
        })

        console.log(notification)

        await notification.save()

        success = true
        res.status(200).json({success , notification})

    } catch (error) {
        console.error(error)
        return res.status(500).json({success , error: "Error While Adding Notification"})
    }
}



exports.fetchNotifications = async (req , res) => {
    let success = false
    try {

        const notifications = await Notification.find({ user: req.user.id }).sort({ date: -1 });
        success = true
        console.log(notifications)
        res.status(200).json({success , notifications})

    } catch (error) {
        console.error(error)
        return res.status(500).json({success , error: "Error While Fetching Notifications"})
    }
}


exports.fetchTransactions = async (req , res) => {
    let success = false
    try {

        const transactions = await Transaction.find({
            $or: [
              { sellerId: req.user.id },
              { bidderId: req.user.id }
            ]
          }).sort({ date: -1 });

          const newTransactions = transactions.map(transaction => {
            if (transaction.sellerId.toString() === req.user.id.toString()) {
              return { ...transaction.toObject(), isSeller: true };
            } else {
              return { ...transaction.toObject(), isSeller: false };
            }
          });
          
          console.log(newTransactions);
          
        success = true
        res.status(200).json({success , newTransactions})

    } catch (error) {
        console.error(error)
        return res.status(500).json({success , error: "Error While Fetching Notifications"})
    }
}