import errorHandler from '#middleware/error'
import routes from '#routes'
import connectDb from '#utils/db'
import colors from 'colors'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'

const port = process.env.PORT || 9000
const app = express()

// connect to the database
connectDb()

app.use(cors())

//To parse the body of the request
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

app.use(errorHandler)

app.use('/api', routes)

app.get('/', (req, res) => {
  res.json({ msg: 'Welcome to the Double Text API.' })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}.`.bgBlue)
})
