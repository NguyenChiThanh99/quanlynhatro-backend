const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.authenticateToken = async function(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.status(401).json({status: false, message: 'Unauthorized user!'}) //if there isn't any token

        const jwtuser = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!jwtuser) res.status(401).json({status: false, message: 'Unauthorized user!'})

        const user = await User.findOne({ email: jwtuser.email, isDeleted: false });
        if (!user) res.status(401).json({status: false, message: 'Unauthorized user!'})
        req.user = user;
        next()
    } catch(err) {
        return res.status(401).json({status: false, message: 'Unauthorized user!'})
    }
}