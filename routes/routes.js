const express = require('express')
const router = express.Router()
const {Register, ChangePassword} = require('../controllers/User')


////////////////////////////////////////////////////////////REGISTER
router.post('/user/register', Register)
///////////////////////////////////////////////////////////CHANGE PASSWORD
router.post('/user/changepassword', ChangePassword)



module.exports = router;