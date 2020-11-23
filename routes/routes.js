const express = require('express')
const router = express.Router()
const {register} = require('../controllers/User')


////////////////////////////////////////////////////////////REGISTER
router.post('/user/register', register)



module.exports = router;