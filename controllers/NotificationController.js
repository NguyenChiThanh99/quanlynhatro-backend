const Notification = require('../models/Notification')
const Block = require('../models/Block')
const Room = require('../models/Room')
const User = require('../models/User')

exports.CreateNotification = async function(req, res) {
    if (!req.body) {
        return res.json({
            status: false,
            message: "Empty Body"
        })
    }
    try {
        const noti = {
            userId: req.body.userId,
            deliveryId: req.body.deliveryId,
            content: req.body.content,
            type: req.body.type
        }
        if (!noti.userId) {
            return res.json({
                status: false,
                message: "UserId is required"
            })
        }
        if (!noti.content) {
            return res.json({
                status: false,
                message: "Content is required"
            })
        }
        const checkUser = await User.findOne({ _id: noti.userId, role: "Admin", isDeleted: false})
        if (!checkUser) {
            return res.json({
                status: false,
                message: "User không tồn tại"
            })
        }
        if (noti.type == "Room") {
            const checkRoom = await Room.findOne({ _id: noti.deliveryId, isDeleted: false })
            if (!checkRoom) {
                return res.json({
                    status: false,
                    message: "Room không tồn tại"
                })
            }
        }
        if (noti.type == "Block") {
            const checkBlock = await Block.findOne({ _id: noti.deliveryId, isDeleted: false })
            if (!checkBlock) {
                return res.json({
                    status: false,
                    message: "Block không tồn tại"
                })
            }
        }
        const newnoti = new Notification(noti);
        await newnoti.save();
        return res.json({
            status: true,
            Notification: newnoti
        })
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}

exports.GetAllNotiByAdminId = async function(req, res) {
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
        const checkUser = await User.findOne({ _id: userId, role: "Admin", isDeleted: false})
        if (!checkUser) {
            return res.json({
                status: false,
                message: "UserId không tồn tại"
            })
        }
        const checkNoti = await Notification.find({ userId: userId, isDeleted: false })
        if (!checkNoti || checkNoti == '' || checkNoti == null) {
            return res.json({
                status: false,
                message: "Lỗi...Không có thông báo"
            })
        } else {
            return res.json({
                status: true,
                Notification: checkNoti
            })
        }
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}