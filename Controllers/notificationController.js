
const Notification = require('../Models/notificationModel')

exports.addNotification = async (req , res) => {
    let success = false
    try {

        const { message , id } = req.body
        const notification = await Notification.create({
            user: id,
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
        //const user1 = req.user;
        //const user = await User.find({_id: user1.id})
        // notifications.forEach(notification => {
        //     if(user[0].newNotifications.includes(notification._id)){
        //         notification.isNew = true
        //     }
        //     else notification.isNew = false
        // })

        success = true
        res.status(200).json({success , notifications})

    } catch (error) {
        console.error(error)
        return res.status(500).json({success , error: "Error While Fetching Notifications"})
    }
}

