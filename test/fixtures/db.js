const User = require('../../src/model/user')
const Transaction = require('../../src/model/transaction')

const fakeUsers = [
  {
    name: 'usertest1',
    email: 'usertest1@mail.com',
    password: '12345678'
  },
  {
    name: 'usertest2',
    email: 'usertest2@mail.com',
    password: '12345678'
  },
  {
    name: 'usertest3',
    email: 'usertest3@mail.com',
    password: '12345678'
  }
]

const fakeTransactions = [
  {
    type: 'income',
    title: 'test 1 inc',
    amount: 5000
  },
  {
    type: 'expense',
    title: 'test 2 exp',
    amount: 3000
  },
  {
    type: 'expense',
    title: 'test 3 exp',
    amount: 1200
  }
]

const generateFakeData = async () => {
  await new User(fakeUsers[0]).save()
  await new User(fakeUsers[1]).save()
  await new User(fakeUsers[2]).save()

  const users = await User.find({})

  await new Transaction({ ...fakeTransactions[0], owner: users[0]._id }).save()
  await new Transaction({ ...fakeTransactions[1], owner: users[2]._id }).save()
  await new Transaction({ ...fakeTransactions[2], owner: users[2]._id }).save()
}

const cleanupDatabase = async () => {
  await User.deleteMany({})
  await Transaction.deleteMany({})
}

module.exports = {
  cleanupDatabase,
  generateFakeData
}
