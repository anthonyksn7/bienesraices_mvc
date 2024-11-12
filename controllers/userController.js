import { check, validationResult } from 'express-validator'
import User from '../models/User.js';
import { generateId } from '../helpers/tokens.js';
import { registrationEmail } from '../helpers/emails.js';

const loginForm = (req, res) => {
  res.render('auth/login', {
    title: 'Log In',
    csrfToken: req.csrfToken()
  })
}

const signupForm = (req, res) => {
  res.render('auth/signup', {
    title: 'Sign Up',
    csrfToken: req.csrfToken()
  })
}

const register = async (req, res) => {
  await check('name').notEmpty().withMessage('Name is required').run(req)
  await check('email').isEmail().withMessage('Email is not valid').run(req)
  await check('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long').run(req)
  await check('repeat_password').equals(req.body.password).withMessage('Passwords do not match').run(req)

  let result = validationResult(req)

  if (!result.isEmpty()) {
    return res.render('auth/signup', {
      title: 'Sign Up',
      csrfToken: req.csrfToken(),
      errors: result.array(),
      user: {
        name: req.body.name,
        email: req.body.email
      }
    })
  }

  const { email, name, password } = req.body

  const userExists = await User.findOne({where: {email}})

  if (userExists) {
    return res.render('auth/signup', {
      title: 'Sign Up',
      csrfToken: req.csrfToken(),
      errors: [{msg: 'Email already in use'}],
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

  await registrationEmail({
    email: user.email,
    name: user.name,
    token: user.token
  })

  res.render('templates/message', {
    title: 'Confirm your account',
    message: 'We have sent you an email to confirm your account, please check your inbox'
  })
}

const confirm = async (req, res) => {
  const { token } = req.params

  const user = await User.findOne({where: {token}})

  if (!user) {
    res.render('auth/confirm-account', {
      title: 'Error confirming your account',
      message: 'There was an error confirming your account, please try again',
      error: true
    })
  }

  user.token = null
  user.confirmed = true
  await user.save()

  res.render('templates/message', {
    title: 'Account confirmed',
    message: 'Your account has been confirmed successfully'
  })
}

const forgotPasswordForm = (req, res) => {
  res.render('auth/forgot-password', {
    title: 'Recover your access',
    csrfToken: req.csrfToken()
  })
}

export {
  loginForm,
  signupForm,
  register,
  confirm,
  forgotPasswordForm
}