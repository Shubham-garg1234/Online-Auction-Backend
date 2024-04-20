
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
    console.log(req.body);
    const { url, itemName, description, startingPrice } = req.body;
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
          number: auctions[0].number + 1,
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
      image: url,
      starting_price: startingPrice,
      description: description,
      auctionId: selectedAuction._id,
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

exports.getUpcoming = async(req,res) =>{
  try{
    const upcomingAuctions = await Auction.find({ $or: [{ status: 'upcoming' }, { status: 'live' }] });
    return res.status(200).json({ auctions: upcomingAuctions });
  }catch(error){
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

exports.getItemsDetails=async(req,res)=>{
  try{
    itemIds=req.body.itemsArray;
    const itemsDetails = await Item.find({ _id: { $in: itemIds } }).select('-sellerId');;
    if (itemsDetails.length === 0) {
      return res.status(404).json({ message: 'No items found' });
    }
    return res.status(200).json({ items: itemsDetails });

  }catch(error){
    console.error(error);
    return res.status(500).json({ error: error.message });
  } 
}


exports.fetchBiddingItem = async (req, res) => {
  let success = false;
  try {

    const { auctionId } = req.body;

    const auction = await Auction.findById(auctionId)
    const currentBiddingIndex = auction.currentBiddingItem
    const id = auction.items[currentBiddingIndex].id
    const currentBiddingItem = await Item.findById(id)

    console.log(currentBiddingItem)

    const seller = await User.findById(currentBiddingItem.sellerId)
    const bidder = await User.findById(currentBiddingItem.bidderId)
    currentBiddingItem.sellerName = seller.name
    currentBiddingItem.bidderName = bidder !== null ? bidder.name : 'No Bidder Yet'

    success = true
    return res.status(200).json({ success , currentBiddingItem })

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success , error: error.message });
  }
};



exports.make_a_bid = async (req, res) => {
  let success = false;
  try {

    const { auctionId } = req.body;

    const auction = await Auction.findById(auctionId)
    const currentBiddingIndex = auction.currentBiddingItem
    const id = auction.items[currentBiddingIndex].id
    const currentBiddingItem = await Item.findById(id)

    const user = await User.findById(req.user.id)
    const userName = user.name


    let currentBid = currentBiddingItem.current_bid;
    let startingPrice = currentBiddingItem.starting_price;

    if (currentBid === 0) {
        currentBid = startingPrice + startingPrice * 0.1;
    } else {
        currentBid = currentBid + currentBid * 0.1;
    }

    currentBid = parseFloat(currentBid.toFixed(2));

    currentBiddingItem.current_bid = currentBid;
    currentBiddingItem.bidderId = req.user.id;
    await currentBiddingItem.save();


    success = true
    return res.status(200).json({ success , currentBid , userName })

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success , error: error.message });
  }
};