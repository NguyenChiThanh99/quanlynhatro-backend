const User = require('../models/User')
const Block = require('../models/Block')
const Room = require('../models/Room')
const bcrypt = require('bcryptjs')
const mailer = require('../controllers/EmailController')
const jwt = require('jsonwebtoken')

function validateEmail(text) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      return false;
    } else {
      return true;
    }
}

exports.Register = async function(req, res) {
    if (!req.body) {
        return res.json({
            status: false,
            message: "Empty Body"
        })
    }
    try {
        const user = {
            email: req.body.email,
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            cmnd: req.body.cmnd,
            birthday: req.body.birthday ? req.body.birthday : '',
            gender: req.body.gender,
            avatar: req.body.avatar ? req.body.avatar : '',
            job: req.body.job ? req.body.job : '',
            startDate: req.body.startDate ? req.body.startDate: null,
            price: req.body.price ? req.body.price: '',
            block: req.body.block ? req.body.block: null,
            room: req.body.room ? req.body.room: null
        }
        if (!user.email) {
            return res.json({
                status: false,
                message: "Email is required"
            })
        }
        if (user.email && !validateEmail(user.email)) {
            return res.json({
                status: false,
                message: "Email is not correct format"
            })
        }
        const checkEmail = await User.findOne({ email: user.email }) 
        if (checkEmail) {
            return res.json({
                status: false,
                message: 'Email đã được sử dụng'
            })
        }      
        if (!user.name) {
            return res.json({
                status: false,
                message: "Name is required"
            })
        }
        if (!user.phone) {
            return res.json({
                status: false,
                message: "Phone is required"
            })
        }
        if (!user.address) {
            return res.json({
                status: false,
                message: "Phone is required"
            })
        }
        if (!user.cmnd) {
            return res.json({
                status: false,
                message: "CMND is required"
            })
        }
        if (!user.gender) {
            return res.json({
                status: false,
                message: "Gender is required"
            })
        }
        if (user.block) {
            const checkBlock = await Block.findOne({ _id: user.block, isDeleted: false })
            if (!checkBlock) {
                return res.json({
                    status: false,
                    message: "Block Empty"
                })
            }
            if (user.room) {
                const checkRoom = await Room.findOne({ _id: user.room, blockId: checkBlock._id, isDeleted: false })
                if (!checkRoom) {
                    return res.json({
                        status: false,
                        message: "Room Empty"
                    })
                }
            }
        }
        let random = await Math.random().toString(36).substring(7);
        const newuser = new User(req.body);
        newuser.password = await User.hashPassword(random)
        await mailer.SendEmailWithRegister(user.email, random);
        const issave = await newuser.save();
        if (issave) {
            return res.json({
                status: true,
                user: newuser
            })
        } else {
            return res.json({
                status: false,
                message: 'Lỗi không tạo được User'
            })
        }
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}

exports.ChangePassword = async function(req, res) {
    if (!req.body) {
        return res.json({
            status: false,
            message: "Empty Body"
        })
    }
    try {
        const users = {
            email: req.body.email,
            password: req.body.password,
            newpassword: req.body.newpassword,
            newpasswordconfirm: req.body.newpasswordconfirm
        }
        if (!users.email) {
            return res.json({
                status: false,
                message: "Email is required"
            })
        }
        if (users.email && !validateEmail(users.email)) {
            return res.json({
                status: false,
                message: "Email is not correct format"
            })
        }
        if (!users.password) {
            return res.json({
                status: false,
                message: "Password is required"
            })
        }
        if (!users.newpassword) {
            return res.json({
                status: false,
                message: "New Password is required"
            })
        }
        if (!users.newpasswordconfirm) {
            return res.json({
                status: false,
                message: "New Password Confirm is required"
            })
        }
        if (users.newpassword !== users.newpasswordconfirm) {
            return res.json({
                status: false,
                message: "New Password and New Password Confirm are not corrected"
            })
        }
        const checkUser = await User.findOne({ email: users.email })
        if (!checkUser) {
            return res.json({
                status: false,
                message: "Email không có trong database"
            })
        }
        const checkPassword = await bcrypt.compare(users.password, checkUser.password);
        if (!checkPassword) {
            return res.json({
                status: false,
                message: "Password không đúng"
            })
        }
        const hash = await User.hashPassword(users.newpassword);
        checkUser.password = hash;
        checkUser.firstlogin = true;
        await checkUser.save();
        return res.json({
            status: true,
            user: checkUser
        })
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}

exports.ForgetPassword = async function(req, res) {
    if (!req.body) {
        return res.json({
            status: false,
            message: "Empty Body"
        })
    }
    try {
        const email = req.body.email;
        if (!email) {
            return res.json({
                status: false,
                message: "Email is required"
            })
        }
        if (email && !validateEmail(email)) {
            return res.json({
                status: false,
                message: "Email is not correct format"
            })
        }
        const checkUser = await User.findOne({ email: email })
        if (!checkUser) {
            return res.json({
                status: false,
                message: "Email không có trong database"
            })
        }
        let random = await Math.random().toString(36).substring(7);
        checkUser.password = await User.hashPassword(random);
        checkUser.firstlogin = false;
        await mailer.SendEmailWithForgetPassword(checkUser.email, random);
        await checkUser.save();
        return res.json({
            status: true,
            User: checkUser
        })
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}

exports.Login = async function(req, res) {
    if (!req.body) {
        return res.json({
            status: false,
            message: "Empty Body"
        })
    }
    try {
        const users = {
            email : req.body.email,
            password: req.body.password
        }
        if (!users.email) {
            return res.json({
                status: false,
                message: "Email is required"
            })
        }
        if (users.email && !validateEmail(users.email)) {
            return res.json({
                status: false,
                message: "Email is not correct format"
            })
        }
        if (!users.password) {
            return res.json({
                status: false,
                message: "Password is required"
            })
        }
        const checkuser = await User.findOne({ email : users.email })
        if (!checkuser) {
            return res.json({
                status: false,
                message: "Email is not exist"
            })
        }
        const isCompare = await bcrypt.compare(users.password, checkuser.password);
        if (!isCompare) {
            return res.json({
                status: false,
                message: "Login Error"
            })
        }
        const token = await jwt.sign({user: checkuser}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1800s'})
        return res.json({
            status: true,
            user: checkuser,
            token: token
        })
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}

exports.GetAllUserByRoomId = async function(req, res) {
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
        const checkRoom = await Room.findOne({ _id: roomId, isDeleted: false })
        if (!checkRoom) {
            return res.json({
                status: false,
                message: "Phòng không có sẳn"
            })
        }
        const checkUser = await User.find({ room: roomId, isDeleted: false }).populate(['room', 'block'])
        if (!checkUser || checkUser == '' || checkUser == null) {
            return res.json({
                status: false,
                message: "Không có người thuê phòng này"
            })
        } else {
            return res.json({
                status: false,
                User: checkUser
            })
        }
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}

exports.GetUserByEmail = async function(req, res) {
    if (!req.body) {
        return res.json({
            status: false,
            message: "Empty Body"
        })
    }
    try {
        const email = req.body.email;
        if (!email) {
            return res.json({
                status: false,
                message: "Email is required"
            })
        }
        if (email && !validateEmail(email)) {
            return res.json({
                status: false,
                message: "Email is not correct format"
            })
        }
        const checkUser = await User.findOne({ email: email, isDeleted: false }).populate(['room', 'block'])
        if (!checkUser || checkUser == '' || checkUser == null) {
            return res.json({
                status: false,
                message: "User không đúng"
            })
        } else {
            return res.json({
                status: false,
                User: checkUser
            })
        }
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}

exports.GetUserByAdminId = async function(req, res) {
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

    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}

exports.UpdateCustomer = async function(req, res) {
    if (!req.body) {
        return res.json({
            status: false,
            message: "Empty Body"
        })
    }
    try {
        const userupdate = {
            email: req.body.email,
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            cmnd: req.body.cmnd,
            birthday: req.body.birthday,
            gender: req.body.gender,
            job: req.body.job
        }
        if (!userupdate.email) {
            return res.json({
                status: false,
                message: "Email is required"
            })
        }
        if (userupdate.email && !validateEmail(userupdate.email)) {
            return res.json({
                status: false,
                message: "Email is not correct format"
            })
        }
        const checkEmail = await User.findOne({ email: user.email }) 
        if (checkEmail) {
            return res.json({
                status: false,
                message: 'Email đã được sử dụng'
            })
        }      
        if (!user.name) {
            return res.json({
                status: false,
                message: "Name is required"
            })
        }
        if (!user.phone) {
            return res.json({
                status: false,
                message: "Phone is required"
            })
        }
        if (!user.address) {
            return res.json({
                status: false,
                message: "Phone is required"
            })
        }
        if (!user.cmnd) {
            return res.json({
                status: false,
                message: "CMND is required"
            })
        }
        if (!user.gender) {
            return res.json({
                status: false,
                message: "Gender is required"
            })
        }
        if (user.block) {
            const checkBlock = await Block.findOne({ _id: user.block, isDeleted: false })
            if (!checkBlock) {
                return res.json({
                    status: false,
                    message: "Block Empty"
                })
            }
            if (user.room) {
                const checkRoom = await Room.findOne({ _id: user.room, blockId: checkBlock._id, isDeleted: false })
                if (!checkRoom) {
                    return res.json({
                        status: false,
                        message: "Room Empty"
                    })
                }
            }
        }
        let random = await Math.random().toString(36).substring(7);
        const newuser = new User(req.body);
        newuser.password = await User.hashPassword(random)
        await mailer.SendEmailWithRegister(user.email, random);
        const issave = await newuser.save();
        if (issave) {
            return res.json({
                status: true,
                user: newuser
            })
        } else {
            return res.json({
                status: false,
                message: 'Lỗi không tạo được User'
            })
        }
    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}