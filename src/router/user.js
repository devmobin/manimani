const express = require('express')

const User = require('../model/user')
const validator = require('../middleware/validator/user')

const router = express.Router()

router.post('/signup', validator.signupValidation, async ({ body }, res) => {
  const user = new User(body)

  try {
    await user.save()

    const token = await user.generateAuthToken()

    res.status(201).send({ user, token })
  } catch (e) {
    res.status(500).send()
  }
})
