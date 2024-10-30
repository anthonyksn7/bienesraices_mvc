import { check, validationResult } from 'express-validator'
import User from '../models/User.js'
import { generateId } from '../helpers/token.js'
import { registerEmail, forgotPasswordEmail } from '../helpers/emails.js'

const loginForm = (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        csrfToken: req.csrfToken(),
    })
}

const registerForm = (req, res) => {
    res.render('auth/register', {
        title: 'Create Account',
        csrfToken: req.csrfToken(),
    })
}

const register = async (req, res) => {
    await check('name').notEmpty().withMessage('Name cannot be empty').run(req)
    await check('email').isEmail().withMessage('Must be a valid email address').run(req)
    await check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').run(req)
    await check('repeat_password').equals(req.body.password).withMessage('Passwords do not match').run(req)

    const result = validationResult(req)

    if (!result.isEmpty()) {
        return res.render('auth/register', {
            title: 'Create Account',
            csrfToken: req.csrfToken(),
            errors: result.array(),
            user: {
                name: req.body.name,
                email: req.body.email
            }
        })
    }

    const { name, email, password } = req.body

    const userExists = await User.findOne({ where: { email } })

    if (userExists) {
        return res.render('auth/register', {
            title: 'Create Account',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'User already exists' }],
            user: {
                name: req.body.name,
                email: req.body.email
            }
        })
    }

    const user = await User.create({
        name,
        email,
        password,
        token: generateId()
    })

    await registerEmail({
        name: user.name,
        email: user.email,
        token: user.token
    })

    res.render('templates/message', {
        title: 'Account Created Successfully',
        message: 'Please check your email for account confirmation'
    })
}

const confirm = async (req, res) => {

    const { token } = req.params

    const user = await User.findOne({ where: { token } })

    if (!user) {
        return res.render('auth/confirm-account', {
            title: 'Error Confirming Your Account',
            message: 'There was an error confirming your account, try again ',
            error: true
        })
    }

    user.token = null
    user.confirmed = true

    await user.save()

    res.render('auth/confirm-account', {
        title: 'Account Confirmed',
        message: 'Your account has been confirmed'
    })
}

const forgotPasswordForm = (req, res) => {
    res.render('auth/forgot-password', {
        title: 'Reset Password',
        csrfToken: req.csrfToken(),
    })
}

const resetPasswordForm = async (req, res) => {
    await check('email').isEmail().withMessage('Must be a valid email address').run(req)

    const result = validationResult(req)

    if (!result.isEmpty()) {
        return res.render('auth/forgot-password', {
            title: 'Reset Password',
            csrfToken: req.csrfToken(),
            errors: result.array()
        })
    }

    const { email } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) {
        return res.render('auth/forgot-password', {
            title: 'Reset Password',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'User does not exist' }]
        })
    }

    user.token = generateId()
    await user.save()

    await forgotPasswordEmail({
        name: user.name,
        email: user.email,
        token: user.token
    })

    res.render('templates/message', {

    })
}

const verifyToken = async (req, res) => {

    const { token } = req.params


}

const newPassword = async (req, res) => {

}

export {
    loginForm,
    registerForm,
    register,
    confirm,
    forgotPasswordForm,
    resetPasswordForm,
    verifyToken,
    newPassword
}