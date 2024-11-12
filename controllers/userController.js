const loginForm = (req, res) => {
  res.render('auth/login', {
    title: 'Log In'
  })
}

const signupForm = (req, res) => {
  res.render('auth/signup', {
    title: 'Sign Up'
  })
}

const forgotPasswordForm = (req, res) => {
  res.render('auth/forgot-password', {
    title: 'Recover your access'
  })
}

export {
  loginForm,
  signupForm,
  forgotPasswordForm
}