const User = require('../models/User')
const bcrypt = require('bcryptjs')
const mailer = require('./Email')

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
            job: req.body.job
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
        if (!user.job) {
            return res.json({
                status: false,
                message: "Job is required"
            })
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
        const checkUser = await User.findOne({ email: email })
        if (!checkUser) {
            return res.json({
                status: false,
                message: "Email không có trong database"
            })
        }
        let random = await Math.random().toString(36).substring(7);
        checkUser.password = await User.hashPassword(random);
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