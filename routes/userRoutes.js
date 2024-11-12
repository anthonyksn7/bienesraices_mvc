import express from 'express'
import { loginForm, signupForm, forgotPasswordForm } from '../controllers/userController.js';

const router = express.Router()

router.get('/login', loginForm)

router.get('/signup', signupForm)

router.get('/forgot-password', forgotPasswordForm)

export default router