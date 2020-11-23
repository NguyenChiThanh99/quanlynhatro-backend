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

exports.register = async function(req, res) {
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

    } catch(err) {
        return res.json({
            status: false,
            message: err.message
        })
    }
}