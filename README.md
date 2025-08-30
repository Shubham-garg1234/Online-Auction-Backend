We have built a full-stack auction platform using the MERN stack where users can bid on items using virtual coins. Users register and authenticate securely via JWT, upload items, and participate in timed auctions. Coins are used as bidding currency, and users can top up coins using Razorpay integration.

The backend is built with Node.js and Express, the database is MongoDB with Mongoose, and Redis was optionally used for caching auction state or user sessions. I implemented bidding validation, transaction recording, and automatic winner selection at auction end.

we faced real-world challenges like MongoDB query optimization and handling race conditions during concurrent bids, which we addressed using atomic updates and indexing. The app is scalable, with plans for Docker-based deployment and Redis-backed performance tuning.
