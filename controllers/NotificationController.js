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
            const nameNoti = []
            for (let index = 0; index < checkNoti.length; index++) {
                if (checkNoti[index].type == "Room") {
                    const checkRoom = await Room.findOne({ _id: checkNoti[index].deliveryId }).select({ name: 1, _id: 0 })
                    nameNoti.push(checkRoom)
                }
                if (checkNoti[index].type == "Block") {
                    const checkBlock = await Block.findOne({ _id: checkNoti[index].deliveryId }).select({ name: 1, _id: 0 })
                    nameNoti.push(checkBlock)
                }
                if (checkNoti[index].type == "All") {
                    nameNoti.push(null)
                }
            }
            return res.json({
                status: true,
                Notification: checkNoti,
                Name: nameNoti
            })
        }
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}

exports.GetNotiByBlockAndRoomId = async function(req, res) {
    if (!req.body) {
        return res.json({
            status: false,
            message: "Empty Body"
        })
    }
    try {
        const blockId = req.body.blockId;
        const roomId = req.body.roomId;
        if (!blockId) {
            return res.json({
                status: false,
                message: "BlockId is required"
            })
        }
        if (!roomId) {
            return res.json({
                status: false,
                message: "RoomId is required"
            })
        }
        const checkRoom = await Room.findOne({ _id: roomId, isDeleted: false})
        if (!checkRoom) {
            return res.json({
                status: false,
                message: "RoomId không tồn tại"
            })
        }
        const checkBlock = await Block.findOne({ _id: blockId, isDeleted: false})
        if (!checkBlock) {
            return res.json({
                status: false,
                message: "BlockId không tồn tại"
            })
        }
        let checkNotiAll = await Notification.find({ type: "All", isDeleted: false })
        const checkNotiRoom = await Notification.find({ type: "Room", deliveryId: roomId, isDeleted: false })
        if (checkNotiRoom.length != 0) {
            checkNotiAll = checkNotiAll.concat(checkNotiRoom)
        }
        const checkNotiBlock = await Notification.find({ type: "Block", deliveryId: blockId, isDeleted: false })
        if (checkNotiBlock.length != 0) {
            checkNotiAll = checkNotiAll.concat(checkNotiBlock)
        }
        if (!checkNotiAll || checkNotiAll == '' || checkNotiAll == null) {
            return res.json({
                status: false,
                message: "Lỗi... Không có thông báo"
            })
        } else {
            return res.json({
                status: true,
                Notification: checkNotiAll
            })
        }
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}