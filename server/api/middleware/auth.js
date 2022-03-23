const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function auth(req, res, next){
    const token  = req.header('x-auth-token');
    if(!token){
        res.status(401).send('Access denied. No token provided.')
        return;
    };
    
    try{
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        req.user = decoded;
        next();
    }
    catch{
        res.status(400).send('Invalid Token.');
    };
};