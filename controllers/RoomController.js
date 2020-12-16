const Room = require('../models/Room')
const User = require('../models/User')
const Block = require('../models/Block')

exports.Create = async function(req, res) {
    if (!req.body) {
        return res.json({
            status: false,
            message: "Empty Body"
        })
    }
    try {
        const room = {
            name: req.body.name,
            blockId: req.body.blockId,
            price: req.body.price,
            area: req.body.area,
            device: req.body.device,
            rooftop: req.body.rooftop,
            image: req.body.image,
            service: req.body.service
        }
        if (!room.name) {
            return res.json({
                status: false,
                message: "Name is required"
            })
        }
        if (!room.blockId) {
            return res.json({
                status: false,
                message: "BlockId is required"
            })
        }
        const checkBlock = await Block.findOne({ _id: room.blockId })
        if (!checkBlock) {
            return res.json({
                status: false,
                message: "Block không tồn tại"
            })
        }
        if (!room.price) {
            return res.json({
                status: false,
                message: "Price is required"
            })
        }
        if (!room.area) {
            return res.json({
                status: false,
                message: "Area is required"
            })
        }
        if (!room.device) {
            return res.json({
                status: false,
                message: "Device is required"
            })
        }
        if (!room.rooftop) {
            return res.json({
                status: false,
                message: "Rooftop is required"
            })
        }
        if (!room.image) {
            return res.json({
                status: false,
                message: "Image is required"
            })
        }
        
        const newblock = new Block(block);
        await newblock.save();
        return res.json({
            status: true,
            Block: newblock
        })
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}

exports.GetAllBlockByAdminId = async function(req, res) {
    if (!req.body) {
        return res.json({
            status: false,
            message: "Empty Body"
        })
    }
    try {
        const userId = req.body.userId
        if (!userId) {
            return res.json({
                status: false,
                message: "UserId is required"
            })
        }
        const checkUserId = await User.findOne({ _id: userId, role: "Admin", isDeleted: false })
        if (!checkUserId) {
            return res.json({
                status: false,
                message: "UserId không tồn tại hoặc không đủ điều kiện"
            })
        }
        const checkBlock = await Block.find({ userId: userId, isDeleted: false })
        if (!checkBlock || checkBlock == null || checkBlock == '') {
            return res.json({
                status: false,
                message: "Không tìm thấy Block"
            })
        } else {
            return res.json({
                status: false,
                Block: checkBlock
            })
        }
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}