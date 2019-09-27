const User = require('../model/user')

const checkUserExist = async email => {
  const user = await User.findOne({ email }).select('email -_id')

  if (user && user.email === email) {
    return 'email is already exists'
  }
}

module.exports = checkUserExist
