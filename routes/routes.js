const express = require('express')
const router = express.Router()
const {authenticateToken} = require('../controllers/AuthController')
const {Register, ChangePassword, ForgetPassword, Login} = require('../controllers/UserController')
const {Create, GetAllBlockByAdminId} = require('../controllers/BlockController')
const {CreateService, getServiceByAdminId} = require('../controllers/ServiceController')

///USER
router.post('/user/register', Register)
router.post('/user/changepassword', ChangePassword)
router.post('/user/forgetpassword', ForgetPassword)
router.post('/user/login', Login)

///BLOCK
router.post('/block/create', Create)
router.post('/block/getallblockbyadminid', GetAllBlockByAdminId)


///SERVICE
router.post('/service/create', CreateService)
router.post('/service/getservicebyadminid', getServiceByAdminId)

module.exports = router;