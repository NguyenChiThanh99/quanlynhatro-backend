const express = require('express')
const router = express.Router()
const {Register, ChangePassword, ForgetPassword} = require('../controllers/User')


////////////////////////////////////////////////////////////REGISTER
router.post('/user/register', Register)
///////////////////////////////////////////////////////////CHANGE PASSWORD
router.post('/user/changepassword', ChangePassword)
///////////////////////////////////////////////////////////FORGET PASSWORD
router.post('/user/forgetpassword', ForgetPassword)



module.exports = router;