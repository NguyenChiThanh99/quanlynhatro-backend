const Service = require('../models/Service')
const User = require('../models/User')

exports.CreateService = async function(req, res) {
    if (!req.body) {
        return res.json({
            status: false,
            message: "Empty Body"
        })
    }
    try {
        const service = {
            name: req.body.name,
            price: req.body.price,
            calculate: req.body.calculate ? req.body.calculate : '',
            userId: req.body.userId
        }
        if (!service.name) {
            return res.json({
                status: false,
                message: "Name is required"
            })
        }
        if (!service.price) {
            return res.json({
                status: false,
                message: "Price is required"
            })
        }
        if (!service.userId) {
            return res.json({
                status: false,
                message: "UserId is required"
            })
        }
        const checkUser = await User.findOne({ _id: service.userId, role: "Admin", isDeleted: false })
        if (!checkUser) {
            return res.json({
                status: false,
                message: "User không tồn tại"
            })
        }
        const newservice = new Service(service);
        await newservice.save();
        return res.json({
            status: true,
            Service: newservice
        })
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}

exports.getServiceByAdminId = async function(req, res) {
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
        const service = await Service.find({ userId: userId, isDeleted: false })
        if (!service || service == '' || service == null) {
            return res.json({
                status: false,
                message: "Service rỗng"
            })
        } else {
            return res.json({
                status: true,
                Service: service
            })
        }
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}