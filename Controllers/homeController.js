
const User = require('../Models/userModel')
const Item=require('../Models/itemModel')

exports.getdetails = async (req, res) => {
    try {

      const user = await User.findById(req.user.id);
  
      if (user) {
        console.log(user);
        return res.status(200).json({user});
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });
    }
};

exports.uploaditems = async (req, res) => {
  try {
    const { imageUrl, itemName, description, startingPrice } = req.body;
    const userId = req.user.id;

    // Check if user exists and has enough coins
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const coinsRequired = startingPrice * 0.1; // 10% of starting price
    if (user.coins < coinsRequired) {
      return res.status(400).json({ error: 'Insufficient coins' });
    }

    // Deduct coins from user
    user.coins -= coinsRequired;
    await user.save();

    // Create the new item
    const newItem = await Item.create({
      sellerId: userId,
      name: itemName,
      image: imageUrl,
      starting_price: startingPrice,
      description: description,
    });
    return res.status(201).json({ message: 'Item uploaded successfully', newItem });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};