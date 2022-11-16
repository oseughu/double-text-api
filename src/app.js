import errorHandler from '#middleware/error'
import routes from '#routes'
import connectDb from '#utils/db'
import colors from 'colors'
// import cookieParser from 'cookie-parser'
import MongoStore from 'connect-mongo'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import session from 'express-session'

const port = process.env.PORT || 9000
const app = express()

// connect to the database
connectDb()

//To parse the body of the request
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.use(cookieParser())

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      maxAge: 1000 * 60 * 60,
      sameSite: 'none',
      // httpOnly: false,
      secure: true
    }
  })
)

app.set('trust proxy', 1)

app.use(errorHandler)

app.use('/api', routes)

app.get('/', (req, res) => {
  res.json({ msg: 'Welcome to the Double Text API.' })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}.`.bgBlue)
})
