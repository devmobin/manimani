const validator = require('validator')

const userExists = require('../../util/user-exists')

const signupValidation = async ({ body }, res, next) => {
  if (!body.email || !body.password) {
    return res.status(400).send({
      error: 'please enter all the required fields [email, password]'
    })
  }

  if (!validator.isEmail(body.email)) {
    return res.status(400).send({ error: 'please enter valid email' })
  }

  const userExist = await userExists(body.email)
  if (userExist) {
    res.status(400).send({ error: userExist })
  }

  if (
    !validator.isLength(validator.trim(body.password), {
      min: 7,
      max: 50
    }) ||
    body.password.includes('password')
  ) {
    return res.status(400).send({ error: 'please enter a better password' })
  }

  next()
}

const loginValidation = ({ body }, res, next) => {
  if (!body.email || !body.password) {
    return res.status(400).send({
      error: 'please enter all the required fields [email, password]'
    })
  }

  if (!validator.isEmail(body.email)) {
    return res.status(400).send({ error: 'please enter valid email' })
  }

  next()
}

module.exports = {
  signupValidation,
  loginValidation
}
