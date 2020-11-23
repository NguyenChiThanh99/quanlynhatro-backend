const express = require('express')
const router = express.Router()
const {Register} = require('../controllers/User')


////////////////////////////////////////////////////////////REGISTER
router.post('/user/register', Register)



module.exports = router;