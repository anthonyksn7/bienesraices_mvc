import express from 'express'
import { loginForm, signupForm, register, confirm, forgotPasswordForm } from '../controllers/userController.js';

const router = express.Router()

router.get('/login', loginForm)

router.get('/signup', signupForm)
router.post('/signup', register)

router.get('/confirm/:token', confirm)

router.get('/forgot-password', forgotPasswordForm)

export default router