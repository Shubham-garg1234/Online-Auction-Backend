
const User = require('../Models/userModel')

exports.getdetails = async (req, res) => {
    try {
        
      const user = await User.findById(req.user.id);
  
      if (user) {
        return res.status(200).json(user);
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });
    }
};