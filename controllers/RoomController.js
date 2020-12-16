const Room = require('../models/Room')
const User = require('../models/User')
const Block = require('../models/Block')
const Service = require('../models/Service')

exports.CreateRoom = async function(req, res) {
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
        if (room.service) {
            for (let i = 0; i < room.service.length; i++) {
                const checkService = await Service.findOne({ _id: room.service[i], isDeleted: false })
                if (!checkService) {
                    return res.json({
                        status: false,
                        message: "Service không tồn tại"
                    })
                }
            }
        }
        const newroom = new Room(room);
        await newroom.save();
        return res.json({
            status: true,
            Room: newroom
        })
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}

exports.GetRoomByBlockId = async function(req, res) {
    if (!req.body) {
        return res.json({
            status: false,
            message: "Empty Body"
        })
    }
    try {
        const blockId = req.body.blockId;
        if (!blockId) {
            return res.json({
                status: false,
                message: "BlockId is required"
            })
        }
        const checkBlock = await Block.findOne({ _id: blockId })
        if (!checkBlock) {
            return res.json({
                status: false,
                message: "Block không tồn tại"
            })
        }
        const checkRoom = await Room.find({ blockId: blockId, isDeleted: false })
        if (!checkRoom || checkRoom == '' || checkRoom == null) {
            return res.json({
                status: false,
                message: "Room Empty"
            })
        } else {
            const person = await Promise.all(checkRoom.map(async room => {
                return await User.find({ room: room._id, block: room.blockId, isDeleted: false }).countDocuments();
            }))
            return res.json({
                status: true,
                Room: checkRoom,
                Person: person
            })
        }
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}

exports.DeleteRoom = async function(req, res) {
    if (!req.body) {
        return res.json({
            status: false,
            message: "Empty Body"
        })
    }
    try {
        const roomId = req.body.roomId;
        if (!roomId) {
            return res.json({
                status: false,
                message: "RoomId is required"
            })
        }
        const checkRoom = await Room.findOne({ _id: roomId })
        if (!checkRoom) {
            return res.json({
                status: false,
                message: "Room không tồn tại"
            })
        }
        const deleteRoom = await Room.updateOne({ _id: roomId }, { $set: { isDeleted: true } })
        if (!deleteRoom || deleteRoom == null || deleteRoom == '') {
            return res.json({
                status: false,
                message: "Lỗi, Không thể xóa Phòng"
            })
        } else {
            return res.json({
                status: true,
                message: "Phòng được xóa thành công"
            })
        }
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}