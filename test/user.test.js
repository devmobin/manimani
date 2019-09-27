const db = require('./fixtures/db')
const app = require('../src/app')
const request = require('supertest')
const User = require('../src/model/user')

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

  // read user profile
  await request(app)
    .get('/user/me')
    .set('Authorization', `Bearer ${response.body.token}`)
    .send()
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

// edit user profile test
test('success edit user profile', async () => {
  const response = await request(app)
    .patch('/user/me')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'mobin',
      email: 'devmobin@gmail.com'
    })
    .expect(200)

  expect(id).toEqual(response.body._id)
  const user = await User.findById(id)
  expect(user.name).toEqual('mobin')
  expect(user.email).toEqual('devmobin@gmail.com')
})

test('failure edit user profile', async () => {
  await request(app)
    .patch('/user/me')
    .set('Authorization', `Bearer ${token}`)
    .send({
      location: 'tehran'
    })
    .expect(400)

  await request(app)
    .patch('/user/me')
    .set('Authorization', `Bearer ${token}w`)
    .send({
      name: 'mobin'
    })
    .expect(401)
})
