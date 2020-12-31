const Request = require('../models/Request')
const Block = require('../models/Block')
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
            content: req.body.content,
            blockId: req.body.blockId
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
        const checkBlock = await Block.findOne({ _id: request.blockId, isDeleted: false})
        if (!checkBlock) {
            return res.json({
                status: false,
                message: "Block không tồn tại"
            })
        }
        const checkUser = await User.findOne({ _id: request.userId, role: "User", isDeleted: false, block: checkBlock._id })
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

exports.GetRequestByUserId = async function(req, res) {
    if (!req.body) {
        return res.json({
            status: false,
            message: "Empty Body"
        })
    }
    try {
        const userId = req.body.userId;
        if (!userId) {
            return res.json({
                status: false,
                message: "UserId is required"
            })
        }
        const checkUser = await User.findOne({ _id: userId, role: "User", isDeleted: false })
        if (!checkUser) {
            return res.json({
                status: false,
                message: "User không tồn tại"
            })
        }
        const checkRequest = await Request.find({ userId: userId, isDeleted: false })
        if (!checkRequest || checkRequest == '' || checkRequest == null) {
            return res.json({
                status: false,
                message: "Không tìm thấy yêu cầu"
            })
        } else {
            return res.json({
                status: true,
                Request: checkRequest
            })
        }
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}

exports.GetRequestByAdminId = async function(req, res) {
    if (!req.body) {
        return res.json({
            status: false,
            message: "Empty Body"
        })
    }
    try {
        const userId = req.body.userId;
        if (!userId) {
            return res.json({
                status: false,
                message: "UserId is required"
            })
        }
        const checkUser = await User.findOne({ _id: userId, role: "Admin", isDeleted: false })
        if (!checkUser) {
            return res.json({
                status: false,
                message: "User không tồn tại"
            })
        }
        const checkBlock = await Block.find({ userId: userId, isDeleted: false })
        if (!checkBlock) {
            return res.json({
                status: false,
                message: "Block không tồn tại"
            })
        }
        const checkRequest = await Promise.all(checkBlock.map(async block => {
            return await Request.find({ blockId: block._id, isDeleted: false })
        }))
        if (!checkRequest || checkRequest == '' || checkRequest == null) {
            return res.json({
                status: false,
                message: "Không tìm thấy yêu cầu"
            })
        } else {
            return res.json({
                status: true,
                Request: checkRequest
            })
        }
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}

exports.UpdateRequest = async function(req, res) {
    if (!req.body) {
        return res.json({
            status: false,
            message: "Empty Body"
        })
    }
    try {
        const request = {
            requestId: req.body.requestId,
            note: req.body.note ? req.body.note : '',
            isSolved: req.body.isSolved ? req.body.isSolved : ''
        }
        if (!request.requestId) {
            return res.json({
                status: false,
                message: "RequestId is required"
            })
        }
        const checkRequest = await Request.findOne({ _id: request.requestId, isDeleted: false })
        if (!checkRequest || checkRequest == '' || checkRequest == null) {
            return res.json({
                status: false,
                message: "Không tìm thấy yêu cầu"
            })
        } else {
            if (request.note != '') checkRequest.note = request.note;
            if (request.isSolved != '') checkRequest.isSolved = request.isSolved;
            checkRequest.save();
            return res.json({
                status: true,
                Request: checkRequest
            })
        }
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}