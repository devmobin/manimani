const db = require('./fixtures/db')
const app = require('../src/app')
const request = require('supertest')

beforeAll(async () => {
  await db.generateFakeData()
}, 1000)

afterAll(async () => {
  await db.cleanupDatabase()
}, 1000)

// test user token and id
// for testing end points that needs authentication
let token, id

// signup tests
test('success signup user', async () => {
  await request(app)
    .post('/user/signup')
    .send({
      email: 'mobin@gmail.com',
      password: 'mobin1234'
    })
    .expect(201)
})

test('failure signup user required field', async () => {
  await request(app)
    .post('/user/signup')
    .send({
      email: 'mobin@gmail.com'
    })
    .expect(400)
})

test('failure signup user invalid email', async () => {
  await request(app)
    .post('/user/signup')
    .send({
      email: 'mobingmail.com',
      password: 'mobin1234'
    })
    .expect(400)
})

// login tests
test('success login', async () => {
  const response = await request(app)
    .post('/user/login')
    .send({
      email: 'mobin@gmail.com',
      password: 'mobin1234'
    })
    .expect(200)

  token = response.body.token
  id = response.body.user._id
})

test('failure login invalid password', async () => {
  await request(app)
    .post('/user/login')
    .send({
      email: 'mobin@gmail.com',
      password: 'mobin12324'
    })
    .expect(400)
})
