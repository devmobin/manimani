const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const userRouter = require('./router/user')
const transactionRouter = require('./router/transaction')

const app = express()

app.use(express.json())
app.use(cors())

app.use('/user', userRouter)
app.use('/transaction', transactionRouter)

app.use((req, res) => {
  res.status(404).send()
})

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

module.exports = app
