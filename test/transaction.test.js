const db = require('./fixtures/db')
const app = require('../src/app')
const request = require('supertest')
const User = require('../src/model/user')
const Transaction = require('../src/model/transaction')

beforeAll(async () => {
  await db.generateFakeData()
}, 1000)

afterAll(async () => {
  await db.cleanupDatabase()
}, 1000)

// test user token and id
// for testing end points that needs authentication
let token, transactionId

// create new transaction
test('success create new transaction', async () => {
  // before test transactions create new user
  await request(app)
    .post('/user/signup')
    .send({
      name: 'mobin',
      email: 'mobin@gmail.com',
      password: 'mobin1234'
    })
  const response = await request(app)
    .post('/user/login')
    .send({
      email: 'mobin@gmail.com',
      password: 'mobin1234'
    })
  token = response.body.token

  // create new transaction
  const responseTransaction = await request(app)
    .post('/transaction/new')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'project',
      type: 'income',
      amount: 2000
    })
    .expect(201)
  transactionId = responseTransaction.body._id
})

test('failure create new transaction anAuthenticated user', async () => {
  await request(app)
    .post('/transaction/new')
    .send({
      title: 'project',
      type: 'income',
      amount: 2000
    })
    .expect(401)
})