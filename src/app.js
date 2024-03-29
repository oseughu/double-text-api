import errorHandler from '#middleware/error'
import routes from '#routes'
import connectDb from '#utils/db'
import colors from 'colors'
import MongoStore from 'connect-mongo'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import session from 'express-session'

const port = process.env.PORT || 9000
const app = express()

const corsOptions = {
  origin: process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : process.env.CLIENT_URL,
  credentials: true
}

app.use(cors(corsOptions))

//To parse json requests
app.use(express.json())

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      maxAge: 24 * 60 * 60 * 100,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'development' ? false : true
    }
  })
)

app.set('trust proxy', 1)

app.use(errorHandler)

app.use('/api', routes)

app.get('/', (req, res) => {
  res.json({ msg: 'Welcome to the Double Text API.' })
})

app.listen(port, async () => {
  // connect to the database
  await connectDb()
  console.log(`Server running on port ${port}.`.bgBlue)
})

export default app
