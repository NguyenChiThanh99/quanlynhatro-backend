const PaymentRoom = require('../models/PaymentRoom')
const Payment = require('../models/Payment')
const Block = require('../models/Block')
const Room = require('../models/Room')

exports.CreatePayment = async function(req, res) {
    if (!req.body) {
        return res.json({
            status: false,
            message: "Empty Body"
        })
    }
    try {
        const payment = {
            month: req.body.month,
            year: req.body.year,
            blockId: req.body.blockId,
            date: req.body.date,
        }
        const content = req.body.content;
        if (!payment.month) {
            return res.json({
                status: false,
                message: "Month is required"
            })
        }
        if (!payment.year) {
            return res.json({
                status: false,
                message: "Year is required"
            })
        }
        if (payment.month == 1) {
            const checkmonthandyear = await Payment.findOne({ month: 12, year: payment.year-1, blockId: payment.blockId ,isDeleted: false })
            if (!checkmonthandyear) {
                return res.json({
                    status: false,
                    message: "Tháng trước chưa được nhập"
                })
            }
        } else {
            const checkmonthandyear = await Payment.findOne({ month: payment.month-1, year: payment.year, blockId: payment.blockId, isDeleted: false })
            if (!checkmonthandyear) {
                return res.json({
                    status: false,
                    message: "Tháng trước chưa được nhập"
                })
            }
        }
        if (!payment.blockId) {
            return res.json({
                status: false,
                message: "BlockId is required"
            })
        }
        const checkBlock = await Block.findOne({ _id: payment.blockId, isDeleted: false})
        if (!checkBlock) {
            return res.json({
                status: false,
                message: "Block không tồn tại"
            })
        }
        if (!payment.date) {
            return res.json({
                status: false,
                message: "Date is required"
            })
        }
        const checkpayment = await Payment.findOne({ blockId: payment.blockId, month: payment.month, year: payment.year, isDeleted: false })
        if (checkpayment) {
            return res.json({
                status: false,
                message: "Payment đã tồn tại"
            })
        }
        const listpaymentroom = [];
        for (let i = 0; i < content.length; i++) {
            const paymentroom = {
                roomId: content[i].roomId,
                service: content[i].service ? content[i].service : null,
                elec: content[i].elec,
                water: content[i].water,
                price: content[i].price,
                total: content[i].total,
                status: content[i].status ? content[i].status : false,
            }
            if (!paymentroom.roomId) {
                return res.json({
                    status: false,
                    message: "RoomId is required"
                })
            }
            const checkRoom = await Room.findOne({ _id: paymentroom.roomId, isDeleted: false})
            if (!checkRoom) {
                return res.json({
                    status: false,
                    message: "Room không tồn tại"
                })
            }
            if (!paymentroom.elec) {
                return res.json({
                    status: false,
                    message: "Elec is required"
                })
            }
            if (!paymentroom.water) {
                return res.json({
                    status: false,
                    message: "Water is required"
                })
            }
            if (!paymentroom.price) {
                return res.json({
                    status: false,
                    message: "Price is required"
                })
            }
            if (!paymentroom.total) {
                return res.json({
                    status: false,
                    message: "Total is required"
                })
            }
            const newpaymentroom = new PaymentRoom(paymentroom);
            await newpaymentroom.save();
            listpaymentroom.push(newpaymentroom._id)
        }
        const newpayment = new Payment(payment);
        newpayment.paymentroom = listpaymentroom;
        await newpayment.save();
        return res.json({
            status: true,
            message: "Payment đã được tạo thành công",
            Payment: newpayment
        })
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}

exports.GetPaymentByBlockId = async function(req, res) {
    if (!req.body) {
        return res.json({
            status: false,
            message: "Empty Body"
        })
    }
    try {
        const blockId = req.body.blockId;
        const month = req.body.month;
        const year = req.body.year;
        if (!blockId) {
            return res.json({
                status: false,
                message: "BlockId is required"
            })
        }
        const checkBlock = await Block.findOne({ _id: blockId, isDeleted: false })
        if (!checkBlock) {
            return res.json({
                status: false,
                message: "Block không tồn tại"
            })
        }
        if (!month) {
            return res.json({
                status: false,
                message: "Month is required"
            })
        }
        if (!year) {
            return res.json({
                status: false,
                message: "Year is required"
            })
        }
        const checkPayment = await Payment.findOne({ blockId: blockId, isDeleted: false, month: month, year: year }).populate('paymentroom')
        if (!checkPayment || checkPayment == '' || checkPayment == null) {
            return res.json({
                status: false,
                message: "Không tìm thấy payment"
            })
        } else {
            return res.json({
                status: true,
                Payment: checkPayment
            })
        }
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}

exports.ChangeStatusPayment = async function(req, res) {
    if (!req.body) {
        return res.json({
            status: false,
            message: "Empty Body"
        })
    }
    try {
        const paymentroomId = req.body.paymentroomId;
        const status = req.body.status;
        if (!paymentroomId) {
            return res.json({
                status: false,
                message: "PaymentRoomId is required"
            })
        }
        const checkPaymentRoom = await PaymentRoom.findOne({ _id: paymentroomId, isDeleted: false })
        if (!checkPaymentRoom || checkPaymentRoom == '' || checkPaymentRoom == null) {
            return res.json({
                status: false,
                message: "Không tìm thấy paymentroom"
            })
        } else {
            checkPaymentRoom.status = status;
            await checkPaymentRoom.save();
            return res.json({
                status: true,
                message: "Thay đổi trạng thái thành công"
            })
        }
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}

exports.GetPaymentRoomSixMonth = async function(req, res) {
    if (!req.body) {
        return res.json({
            status: false,
            message: "Empty Body"
        })
    }
    try {
        const roomId = req.body.roomId;
        const page = req.body.page;
        if (!roomId) {
            return res.json({
                status: false,
                message: "RoomId is required"
            })
        }
        if (!page) {
            return res.json({
                status: false,
                message: "Page is required"
            })
        }
        const checkRoom = await Room.findOne({ _id: roomId, isDeleted: false })
        if (!checkRoom) {
            return res.json({
                status: false,
                message: "Không tìm thấy Room"
            })
        } 
        
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}