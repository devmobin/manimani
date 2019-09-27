const express = require('express')

const User = require('../model/user')
const validator = require('../middleware/validator/user')

const router = express.Router()

router.post('/signup', validator.signupValidation, async ({ body }, res) => {
  const user = new User(body)

  try {
    await user.save()

    res.status(201).send({ user })
  } catch (e) {
    res.status(500).send()
  }
})

router.post('/login', validator.loginValidation, async ({ body }, res) => {
  try {
    const user = await User.loginEmailPass(body.email, body.password)

    const token = await user.generateAuthToken()

    res.status(200).send({ user, token })
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

module.exports = router
