import nodemailer from 'nodemailer'

const registrationEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const {email, name, token} = data

  await transporter.sendMail({
    from: 'Bienes Raices',
    to: email,
    subject: 'Confirm your account',
    text: 'Confirm your account',
    html: `
      <p>Hello ${name}</p>
      <p>To confirm your account, please click on the following link</p>
      <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirm/${token}">Confirm your account</a>
      <p>If you did not create this account, you can ignore this email</p>
      `
  })
}

export {
  registrationEmail
}