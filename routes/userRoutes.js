import express from 'express'
import { loginForm, registerForm, register, confirm, forgotPasswordForm, resetPasswordForm, verifyToken, newPassword } from '../controllers/userControllers.js'

const router = express.Router()

router.get('/login',loginForm)

router.get('/register', registerForm)
router.post('/register', register)

router.get('/confirm/:token', confirm)

router.get('/forgot-password', forgotPasswordForm)
router.post('/forgot-password', resetPasswordForm)

router.get('/forgot-password/:token', verifyToken)
router.post('/forgot-password/:token', newPassword)

export default router