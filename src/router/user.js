const express = require('express')

const User = require('../model/user')
const validator = require('../middleware/validator/user')
const auth = require('../middleware/authentication/auth')

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

    res.status(200).send({ token })
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

router.get('/me', auth, async ({ user }, res) => res.send(user))

router.patch(
  '/me',
  auth,
  validator.editUserProfile,
  async ({ body, user }, res) => {
    const updates = Object.keys(body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every(update =>
      allowedUpdates.includes(update)
    )

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
      updates.forEach(update => (user[update] = body[update]))

      await user.save()

      res.send(user)
    } catch (e) {
      res.status(500).send()
    }
  }
)

router.delete('/me', auth, async ({ user }, res) => {
  try {
    await user.remove()
    res.status(200).send({ user })
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/logout', auth, async ({ token, user }, res) => {
  try {
    user.tokens = user.tokens.filter(t => t.token !== token)

    await user.save()

    res.status(200).send()
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/logoutAll', auth, async ({ user }, res) => {
  try {
    user.tokens = []

    await user.save()

    res.status(200).send()
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router
