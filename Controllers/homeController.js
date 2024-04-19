
const User = require('../Models/userModel')
const Item=require('../Models/itemModel')
const Auction = require('../Models/auctionModel')
const formatDate = require('../Utils/FormatDate')

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

    let selectedAuction = null;

    const auctions = await Auction.find().sort({ starting_time: -1 })

    if(auctions.length == 0){

      let startingTime = new Date();
      startingTime.setDate(startingTime.getDate() + 1);
      startingTime.setHours(12, 0, 0, 0);

      selectedAuction = await Auction.create({
        name: "Auction 1",
        starting_time: startingTime,
        status: 'upcoming',
        number: 1,
      })
    }
    else{
      if(auctions[0].items.length === 15){
        const newAuctionName = 'Auction ' + (auctions[0].number + 1);
        const newAuctionStartingTime = new Date(auctions[0].starting_time.getTime() + 60 * 60 * 1000);
        selectedAuction = await Auction.create({
          name: newAuctionName,
          starting_time: newAuctionStartingTime,
          status: 'upcoming',
          number: auctions[0].number + 1
        })
      }
      else{
        selectedAuction = auctions[0]
      }
    }

    await selectedAuction.save()

    // Create the new item
    const newItem = await Item.create({
      sellerId: userId,
      name: itemName,
      image: imageUrl,
      starting_price: startingPrice,
      description: description,
      auctionId: selectedAuction._id
    });

    await newItem.save()
    selectedAuction.items.push({ id: newItem._id });

    await selectedAuction.save()

    const message = `Your item is successfully registered. It will be sold in auction ${selectedAuction.name} on ${formatDate(selectedAuction.starting_time)}`
    
    return res.status(201).json({ message: message, newItem });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};