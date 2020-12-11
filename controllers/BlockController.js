const Block = require('../models/Block')
const User = require('../models/User')

exports.Create = async function(req, res) {
    if (!req.body) {
        return res.json({
            status: false,
            message: "Empty Body"
        })
    }
    try {
        const block = {
            name: req.body.name,
            image: req.body.image,
            contact: req.body.contact,
            userId: req.body.userId
        }
        if (!block.name) {
            return res.json({
                status: false,
                message: "Name is required"
            })
        }
        if (!block.image) {
            return res.json({
                status: false,
                message: "Image is required"
            })
        }
        if (!block.contact) {
            return res.json({
                status: false,
                message: "Contact is required"
            })
        }
        if (!block.userId) {
            return res.json({
                status: false,
                message: "UserId is required"
            })
        }
        const checkName = await Block.findOne({ name: block.name })
        if (checkName) {
            return res.json({
                status: false,
                message: "Name is used"
            })
        }
        const checkUserId = await User.findOne({ _id: block.userId, role: "Admin", isDeleted: false })
        if (!checkUserId) {
            return res.json({
                status: false,
                message: "UserId không tồn tại hoặc không đủ điều kiện"
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