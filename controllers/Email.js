require('dotenv').config()
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  pool: true,
  service: 'Gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL,
    refreshToken: process.env.EMAIL_REFRESH_TOKEN,
    clientId: process.env.EMAIL_CLIENT_ID,
    clientSecret: process.env.EMAIL_CLIENT_SECRET,
  }
}, {
  from: `QUẢN LÝ NHÀ TRỌ ONLINE quanlynhatro.online <${process.env.EMAIL}>`
})

mailer = async message => {
  await transporter.sendMail(message);
}

module.exports = {
  SendEmailWithRegister(email, password) {
    const message = {
      to: email,
      subject: 'Mật khẩu đăng nhập quanlynhatro.online',
      html: `
        <h3>Bạn đã đăng ký ở quanlynhatro.online</h3>
        <i>Đây là tài khoản đăng nhập vào quanlynhatro.online</i>
        <ul>
          <li>Tài khoản: ${email}</li>
          <li>Mật khẩu: ${password}</li>
        </ul>
        Cảm ơn bạn đã đăng ký trọ tại quanlynhatro.online
      `
    }
    mailer(message);
  }
}