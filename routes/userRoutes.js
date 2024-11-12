import express from 'express'
import { loginForm, authenticate, signupForm, register, confirm, forgotPasswordForm, resetPassword, verifyToken, newPassword } from '../controllers/userController.js';

const router = express.Router()

router.get('/login', loginForm)
router.post('/login', authenticate)

router.get('/signup', signupForm)
router.post('/signup', register)

router.get('/confirm/:token', confirm)

router.get('/forgot-password', forgotPasswordForm)
router.post('/forgot-password', resetPassword)

router.get('/forgot-password/:token', verifyToken)
router.post('/forgot-password/:token', newPassword)

export default router