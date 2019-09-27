const express = require('express')

const User = require('../model/user')

const router = express.Router()

router.post('/signup', async ({ body }, res) => {
  const user = new User(body)

  try {
    await user.save()

    const token = await user.generateAuthToken()

    res.status(201).send({ user, token })
  } catch (e) {
    res.status(500).send()
  }
})
