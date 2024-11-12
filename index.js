import express from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import db from './config/db.js'
import userRoutes from './routes/userRoutes.js';

const app = express()

app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(csrf({ cookie: true }))

try {
  await db.authenticate()
  db.sync()
  console.log('Connected to the database')
} catch (error) {
  console.log(error)
}

app.use(express.static('public'))

app.set('view engine', 'pug')
app.set('views', './views')

app.use('/auth', userRoutes)

const port = process.env.PORT ?? 3000

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})