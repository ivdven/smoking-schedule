require('dotenv').config()

const express = require('express')
const cors = require('cors')
const userRoutes = require('./routes/auth/userRoutes')

const connectMongo = require('./config/db')

const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())
app.use('/api/users', userRoutes)

connectMongo()

app.listen(PORT, () => {
  console.log(`server running on port: http://localhost:${PORT}`)
})