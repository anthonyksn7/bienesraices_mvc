import express from 'express'
import cookieParser from 'cookie-parser'
import csrf from 'csurf'
import db from './config/db.js'
import userRoutes from './routes/userRoutes.js'

const app = express()

app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(csrf({ cookie: true }))

try {
    await db.authenticate()
    db.sync()
    console.log('Connection has been established successfully.')
} catch (error) {
    console.error('Unable to connect to the database:', error)
}

app.use(express.static('public'))

app.set('view engine', 'pug')
app.set('views', './views')

app.use('/auth', userRoutes)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
