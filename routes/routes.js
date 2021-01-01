const express = require('express')
const router = express.Router()
const {authenticateToken} = require('../controllers/AuthController')
const {Register, ChangePassword, ForgetPassword, Login, GetAllUserByRoomId, GetUserByEmail, UpdateCustomer, GetUserByAdminId, UpdateAvatarCustomer, DeletedUser} = require('../controllers/UserController')
const {Create, GetAllBlockByAdminId, GetBlockByRoomId} = require('../controllers/BlockController')
const {CreateService, getServiceByAdminId} = require('../controllers/ServiceController')
const {CreateRoom, GetRoomByBlockId, DeleteRoom, GetAllRoomByUserId, UpdateRoom} = require('../controllers/RoomController')
const {CreateRequest, GetRequestByUserId, UpdateRequest, GetRequestByAdminId} = require('../controllers/RequestController')
const {CreateNotification, GetAllNotiByAdminId, GetNotiByBlockAndRoomId} = require('../controllers/NotificationController')

///USER
router.post('/user/register', Register)
router.post('/user/changepassword', ChangePassword)
router.post('/user/forgetpassword', ForgetPassword)
router.post('/user/login', Login)
router.post('/user/getalluserbyroomid', authenticateToken, GetAllUserByRoomId)
router.post('/user/getuserbyemail', authenticateToken, GetUserByEmail)
router.post('/user/updatecustomer', authenticateToken, UpdateCustomer)
router.post('/user/updateavatarcustomer', authenticateToken, UpdateAvatarCustomer)
router.post('/user/getuserbyadminid', authenticateToken, GetUserByAdminId)
router.post('/user/deleteuser', authenticateToken, DeletedUser)

///BLOCK
router.post('/block/create', authenticateToken, Create)
router.post('/block/getallblockbyadminid', authenticateToken, GetAllBlockByAdminId)
router.post('/block/getblockbyroomid', authenticateToken, GetBlockByRoomId)


///SERVICE
router.post('/service/create', authenticateToken, CreateService)
router.post('/service/getservicebyadminid', authenticateToken, getServiceByAdminId)

///ROOM
router.post('/room/create', authenticateToken, CreateRoom)
router.post('/room/getroombyblockid', authenticateToken, GetRoomByBlockId)
router.post('/room/deleteroom', authenticateToken, DeleteRoom)
router.post('/room/getallroombyuserid', authenticateToken, GetAllRoomByUserId)
router.post('/room/updateroom', authenticateToken, UpdateRoom)

///REQUEST
router.post('/request/create', authenticateToken, CreateRequest)
router.post('/request/getrequestbyuserid', authenticateToken, GetRequestByUserId)
router.post('/request/getrequestbyadminid', authenticateToken, GetRequestByAdminId)
router.post('/request/updaterequest', authenticateToken, UpdateRequest)

//NOTIFICATION
router.post('/notification/create', authenticateToken, CreateNotification)
router.post('/notification/getnotibyadminid', authenticateToken, GetAllNotiByAdminId)
router.post('/notification/getnotibyblockandroomid', GetNotiByBlockAndRoomId)
module.exports = router;