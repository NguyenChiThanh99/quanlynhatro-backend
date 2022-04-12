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

exports.GetAllRoomByUserId = async function(req, res) {
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
                message: "UserId không tồn tại hoặc không đủ điều kiện"
            })
        }
        const checkBlock = await Block.find({ userId: userId, isDeleted: false })
        if (!checkBlock || checkBlock == '' || checkBlock == null) {
            return res.json({
                status: false,
                message: "Block Empty"
            })
        }
        const checkRoom = await Promise.all(checkBlock.map(async block => {
            return await Room.find({ blockId: block._id, isDeleted: false })
        }))
        if (!checkRoom || checkRoom == '' || checkRoom == null) {
            return res.json({
                status: false,
                message: "Room Empty"
            })
        } else {
            const person = await Promise.all(checkRoom.map(async room => {
                const newperson = await Promise.all(room.map(async newroom => {
                    return await User.find({ room: newroom._id, block: newroom.blockId, isDeleted: false }).countDocuments();
                }))
                return newperson;
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

exports.UpdateRoom = async function(req, res) {
    if (!req.body) {
        return res.json({
            status: false,
            message: "Empty Body"
        })
    }
    try {
        const room = {
            roomId: req.body.roomId,
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
        const checkBlock = await Block.findOne({ _id: room.blockId, isDeleted: false })
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
        if (!room.roomId) {
            return res.json({
                status: false,
                message: "RoomId is required"
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
        const checkRoom = await Room.findOne({ _id: room.roomId, isDeleted: false })
        if (!checkRoom) {
            return res.json({
                status: false,
                message: "Phòng không tồn tại"
            })
        } else {
            checkRoom.name = room.name;
            checkRoom.blockId = room.blockId;
            checkRoom.price = room.price;
            checkRoom.area = room.area;
            checkRoom.device = room.device;
            checkRoom.rooftop = room.rooftop;
            checkRoom.image = room.image;
            checkRoom.service = room.service;
            await checkRoom.save();
            return res.json({
                status: true,
                Room: checkRoom
            })
        }
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}