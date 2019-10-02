const User = require('../../src/model/user')
const Transaction = require('../../src/model/transaction')

const getUserId = async email => {
  const user = await User.findOne({ email })
  return user._id
}

const getUserToken = async email => {
  const user = await User.findOne({ email })
  return user.generateAuthToken()
}

const cleanupDatabase = async () => {
  await User.deleteMany({})
  await Transaction.deleteMany({})
}

module.exports = {
  cleanupDatabase,
  getUserId,
  getUserToken
}
