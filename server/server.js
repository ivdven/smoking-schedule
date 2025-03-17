require('dotenv').config()

const express = require('express')
const cors = require('cors')

const connectMongo = require('./config/db')

const app = express()
const PORT = process.env.PORT

connectMongo()

app.use(cors())
app.use(express.json())

app.listen(PORT, () => {
  console.log(`server running on port: http://localhost:${PORT}`)
})