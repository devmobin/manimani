const User = require('../../src/model/user')

const fakeUsers = [
  {
    username: 'usertest1',
    email: 'usertest1@mail.com',
    password: '12345678'
  },
  {
    username: 'usertest2',
    email: 'usertest2@mail.com',
    password: '12345678'
  },
  {
    username: 'usertest3',
    email: 'usertest3@mail.com',
    password: '12345678'
  }
]

const generateFakeData = async () => {
  await new User(fakeUsers[0]).save()
  await new User(fakeUsers[1]).save()
  await new User(fakeUsers[2]).save()
}

const cleanupDatabase = async () => {
  await User.deleteMany({})
}

module.exports = {
  cleanupDatabase,
  generateFakeData
}
