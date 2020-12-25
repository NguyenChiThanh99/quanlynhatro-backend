const express = require('express')
const router = express.Router()
const {authenticateToken} = require('../controllers/AuthController')
const {Register, ChangePassword, ForgetPassword, Login, GetAllUserByRoomId, GetUserByEmail, UpdateCustomer} = require('../controllers/UserController')
const {Create, GetAllBlockByAdminId} = require('../controllers/BlockController')
const {CreateService, getServiceByAdminId} = require('../controllers/ServiceController')
const {CreateRoom, GetRoomByBlockId, DeleteRoom, GetAllRoomByUserId, UpdateRoom} = require('../controllers/RoomController')

///USER
router.post('/user/register', Register)
router.post('/user/changepassword', ChangePassword)
router.post('/user/forgetpassword', ForgetPassword)
router.post('/user/login', Login)
router.post('/user/getalluserbyroomid', authenticateToken, GetAllUserByRoomId)
router.post('/user/getuserbyemail', authenticateToken, GetUserByEmail)
router.post('/user/updatecustomer', authenticateToken, UpdateCustomer)

///BLOCK
router.post('/block/create', authenticateToken, Create)
router.post('/block/getallblockbyadminid', authenticateToken, GetAllBlockByAdminId)


///SERVICE
router.post('/service/create', authenticateToken, CreateService)
router.post('/service/getservicebyadminid', authenticateToken, getServiceByAdminId)

///ROOM
router.post('/room/create', authenticateToken, CreateRoom)
router.post('/room/getroombyblockid', authenticateToken, GetRoomByBlockId)
router.post('/room/deleteroom', authenticateToken, DeleteRoom)
router.post('/room/getallroombyuserid', authenticateToken, GetAllRoomByUserId)
router.post('/room/updateroom', authenticateToken, UpdateRoom)
module.exports = router;