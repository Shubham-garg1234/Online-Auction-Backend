require("dotenv").config();

// Importing jwt
const jwt = require('jsonwebtoken');

// Making JWT_SECRET as a signature
const JWT_SECRET = process.env.JWT_SECRET;
let blacklist = new Set();

// Middleware function to fetch user data
const fetchuser = (req, res, next) => {
    let success = false;

    blacklist = new Set([...blacklist].filter(token => jwt.decode(token) !== null));

    const token = req.header('auth-token');

    if (!token) {
        return res.status(401).send({ success, error: "Please provide a valid authentication token" });
    }

    try {
        if (req.body.message === 'logout') {
            const token = req.header('auth-token');
            if (token) {
                blacklist.add(token);
            }
        }

        if (blacklist.has(token)) {
            return res.status(401).json({ error: 'Token revoked' });
        }

        const data = jwt.verify(token, JWT_SECRET);

        req.user = data.user;
        success = true;
        next();
    } catch (err) {
        console.error("Authentication error:", err);
        res.redirect('http://localhost:1234/')
        res.status(401).send({ success, error: "Invalid authentication token" });
    }
};

//exporting the module fetchuser function
module.exports = fetchuser

