import mongoose from 'mongoose'

const { connect } = mongoose

const connectDb = async () => {
  try {
    const conn = await connect(process.env.MONGO_URI)
    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline.bold)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

export default connectDb
