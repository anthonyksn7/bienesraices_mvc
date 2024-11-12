import { check, validationResult } from 'express-validator'
import User from '../models/User.js';
import { generateId, generateJWT } from '../helpers/tokens.js';
import {forgotPasswordEmail, registrationEmail} from '../helpers/emails.js';
import bcrypt from 'bcrypt';

const loginForm = (req, res) => {
  res.render('auth/login', {
    title: 'Log In',
    csrfToken: req.csrfToken()
  })
}

const authenticate = async (req, res) => {
  await check('email').isEmail().withMessage('Email is not valid').run(req)
  await check('password').notEmpty().withMessage('Password is required').run(req)

  let result = validationResult(req)

  if (!result.isEmpty()) {
    return res.render('auth/login', {
      title: 'Log In',
      csrfToken: req.csrfToken(),
      errors: result.array()
    })
  }

  const { email, password } = req.body

  const user = await User.findOne({where: {email}})

  if (!user) {
    return res.render('auth/login', {
      title: 'Log In',
      csrfToken: req.csrfToken(),
      errors: [{msg: 'User does not exist'}]
    })
  }

  if (!user.confirmed) {
    return res.render('auth/login', {
      title: 'Log In',
      csrfToken: req.csrfToken(),
      errors: [{msg: 'Your account has not been confirmed'}]
    })
  }

  if (!user.verifyPassword(password)) {
    return res.render('auth/login', {
      title: 'Log In',
      csrfToken: req.csrfToken(),
      errors: [{msg: 'Incorrect password'}]
    })
  }

  const token = generateJWT({ id: user.id, name: user.name })

  return res.cookie('_token', token, {
    httpOnly: true,
    // secure: true,
    // sameSite: true
  }).redirect('/mis-propiedades')
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

const resetPassword = async (req, res) => {
  await check('email').isEmail().withMessage('Email is not valid').run(req)

  let result = validationResult(req)

  if (!result.isEmpty()) {
    return res.render('auth/forgot-password', {
      title: 'Recover your access',
      csrfToken: req.csrfToken(),
      errors: result.array()
    })
  }

  const { email } = req.body

  const user = await User.findOne({where: {email}})

  if (!user) {
    return res.render('auth/forgot-password', {
      title: 'Recover your access',
      csrfToken: req.csrfToken(),
      errors: [{msg: 'User does not exist'}],
    })
  }

  user.token = generateId()
  await user.save()

  await forgotPasswordEmail({
    email: user.email,
    name: user.name,
    token: user.token
  })

  res.render('templates/message', {
    title: 'Reset your password',
    message: 'We have sent you an email to reset your password, please check your inbox'
  })
}

const verifyToken = async (req, res) => {
  const { token } = req.params

  const user = await User.findOne({where: {token}})

  if (!user) {
    return res.render('auth/confirm-account', {
      title: 'Reset your password',
      message: 'There was an error validating your information, please try again',
      error: true
    })
  }

  res.render('auth/reset-password', {
    title: 'Reset your password',
    csrfToken: req.csrfToken()
  })
}

const newPassword = async (req, res) => {
  await check('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long').run(req)

  let result = validationResult(req)

  if (!result.isEmpty()) {
    return res.render('auth/reset-password', {
      title: 'Reset your password',
      errors: result.array(),
      csrfToken: req.csrfToken()
    })
  }

  const { token } = req.params
  const { password } = req.body

  const user = await User.findOne({where: {token}})

  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(password, salt)
  user.token = null
  await user.save()

  res.render('auth/confirm-account', {
    title: 'Password reset',
    message: 'Your password has been reset successfully'
  })
}

export {
  loginForm,
  authenticate,
  signupForm,
  register,
  confirm,
  forgotPasswordForm,
  resetPassword,
  verifyToken,
  newPassword
}