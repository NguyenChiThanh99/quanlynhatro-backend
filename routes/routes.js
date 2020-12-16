const express = require('express')
const router = express.Router()
const {authenticateToken} = require('../controllers/AuthController')
const {Register, ChangePassword, ForgetPassword, Login} = require('../controllers/UserController')
const {Create, GetAllBlockByAdminId} = require('../controllers/BlockController')
const {CreateService, getServiceByAdminId} = require('../controllers/ServiceController')
const {CreateRoom, GetRoomByBlockId} = require('../controllers/RoomController')

///USER
router.post('/user/register', Register)
router.post('/user/changepassword', ChangePassword)
router.post('/user/forgetpassword', ForgetPassword)
router.post('/user/login', Login)

///BLOCK
router.post('/block/create', authenticateToken, Create)
router.post('/block/getallblockbyadminid', GetAllBlockByAdminId)


///SERVICE
router.post('/service/create', CreateService)
router.post('/service/getservicebyadminid', getServiceByAdminId)

///ROOM
router.post('/room/create', CreateRoom)
router.post('/room/getroombyblockid', GetRoomByBlockId)
module.exports = router;