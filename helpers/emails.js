import nodemailer from 'nodemailer'

const registerEmail = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const { name, email, token } = data

    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirm your account',
        text: 'Confirm your account',
        html: `
            <p>Hi ${name}, confirm your account</p>     
            
            <p>Your account has been created, click in the link below to confirm it</p>
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirm/${token}">Confirm account</a>

            <p>If you did not create this account, ignore this email</p>
        `
    })
}

const forgotPasswordEmail = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const { name, email, token } = data

    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Reset your password',
        text: 'Reset your password',
        html: `
            <p>Hi ${name}, you have requested to reset your password</p>
            
            <p>Click in the link below to reset your password></p>
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirm/${token}">Confirm account</a>

            <p>If you did not create this account, ignore this email</p>
        `
    })

}

export {
    registerEmail,
    forgotPasswordEmail
}