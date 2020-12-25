const Request = require('../models/Request')
const User = require('../models/User')

exports.CreateRequest = async function(req, res) {
    if (!req.body) {
        return res.json({
            status: false,
            message: "Empty Body"
        })
    }
    try {
        const request = {
            userId: req.body.userId,
            content: req.body.content
        }
        if (!request.content) {
            return res.json({
                status: false,
                message: "Content is required"
            })
        }
        if (!request.userId) {
            return res.json({
                status: false,
                message: "UserId is required"
            })
        }
        const checkUser = await User.findOne({ _id: request.userId, role: "User", isDeleted: false })
        if (!checkUser) {
            return res.json({
                status: false,
                message: "User không tồn tại"
            })
        }
        const newrequest = new Request(request);
        await newrequest.save();
        return res.json({
            status: true,
            Request: newrequest
        })
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}