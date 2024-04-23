
const http = require('http');
const socketIO = require('socket.io');
const express = require('express')
const Auction = require('../Models/auctionModel')
const User = require('../Models/userModel')
const Item=require('../Models/itemModel')

const server = http.createServer(express());
const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});
let auction;
let auctionid;

async function markAuctionAsCompleted(auctionId) {
  try {
      const updatedAuction = await Auction.findOneAndUpdate(
          { _id: auctionId },
          { $set: { status: 'completed' } },
          { new: true }
      );
      if (updatedAuction) {
          console.log('Auction status updated successfully.');
          return updatedAuction;
      } else {
          console.log('Auction not found.');
          return null;
      }
  } catch (error) {
      console.error('Error updating auction status:', error);
      throw error;
  }
}


const fetchNextBiddingItem = async () => {
  let success = false;
  try {


    const auction = await Auction.findById(auctionid)
    let currentBiddingIndex = auction.currentBiddingItem + 1
    auction.currentBiddingItem += 1;
    await auction.save()
    let success
    let currentBiddingItem
    currentBiddingItem="Auction Completed"
    if(currentBiddingIndex === auction.items.length){
      success=true;

      return ({success , currentBiddingItem})
    }

    let id = auction.items[currentBiddingIndex].id
    currentBiddingItem = await Item.findById(id)

    const seller = await User.findById(currentBiddingItem.sellerId)
    const bidder = await User.findById(currentBiddingItem.bidderId)
    currentBiddingItem.sellerName = seller.name
    currentBiddingItem.bidderName = bidder !== null ? bidder.name : 'No Bidder Yet'


    success = true
    return ({ success , currentBiddingItem })

  } catch (error) {
    console.error(error);
    success=false;
    return ({ success , error: error.message });
  }
};

async function start(){
  auction = await Auction.find({ 
    starting_time: { $gt: Date.now() },
    status: { $ne: 'completed' } 
  }).sort({ date: 1 }).limit(1);

    if(auction.length === 0)  timerValue = 10000000000
    else {
      auctionid=auction[0]._id;
      timerValue = Math.floor((new Date(auction[0].starting_time) - new Date()) / 1000);
  }
}
start();

let status="upcoming"
let timerValue = 10000000000;
let currentbid=0;
let nextbid=0;

timerInterval = setInterval(() => {
  timerValue-=1;
  if(timerValue!=0 && timerValue%10000==0){
    async function start2(){
      auction = await Auction.find({ starting_time: { $gt: Date.now() } }).sort({ date: 1 }).limit(1);
        if(auction.length === 0)  timerValue = 10000000000
        else {
          auctionid=auction[0]._id;
          timerValue = Math.floor((new Date(auction[0].starting_time) - new Date()) / 1000);
      }
    }
    start2();
  }
  if (timerValue <= 0) {
    if (status == "live") {
      fetchNextBiddingItem().then(data => {
        status = "hault";
        let message = { status, data };
        if(data.currentBiddingItem=="Auction Completed"){
          status="upcoming";
          markAuctionAsCompleted(auctionid);
        }
        // console.log(message);
        io.emit('fetchNext', message);
        timerValue = 60;
      }).catch(error => {
        console.error(error);
        status = "hault";
        let message = { status, error: error.message };
        io.emit('fetchNext', message);
        timerValue = 60;
      });
    } else if(status=="hault") {
      status = "live";
      let message = { status };
      io.emit('fetchNext', message);
      timerValue = 20;
    }else{
      status = "live";
      timerValue = 20;
    }
  }  
// console.log(timerValue)
}, 1000);



io.on('connection', (socket) => {

  socket.on("join", (token) => {
    console.log('a user connected')
    const details={timer:timerValue, bidamount:currentbid, nextbid:nextbid};
    console.log(details)
    io.to(socket.id).emit('detail_to_all', details);
  });

  socket.on('detail_to_server', (message) => {
    console.log(message);
    timerValue=message.timer;
    currentbid=message.bidamount
    nextbid=message.nextbid
    io.emit('detail_to_all', message);
  });

  socket.on('stopClock' , async () => {
    auction = await Auction.find({ starting_time: { $gt: Date.now() } }).sort({ date: 1 }).limit(1);
    if(auction.length === 0)  timerValue = 10000000000
    else  timerValue = Math.floor((new Date(auction[0].starting_time) - new Date()) / 1000);
    currentbid = 0;
    nextbid = 0;
  })
  

  socket.on('disconnect', () => {
    //
  });
});


server.listen(3001, () => {
  console.log(`Server listening on http://localhost:3003`);
});


module.exports = { timerValue }

