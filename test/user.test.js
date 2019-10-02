const db = require('./fixtures/db')
const app = require('../src/app')
const request = require('supertest')
const User = require('../src/model/user')

const users = [
  {
    email: 'mobin@gmail.com',
    password: 'mobin1234'
  },
  {
    email: 'mobin1@gmail.com',
    password: 'mobin1234'
  },
  {
    email: 'mobin2@gmail.com',
    password: 'mobin1234'
  }
]

afterAll(async () => {
  await db.cleanupDatabase()
})

describe('signup tests', () => {
  test.each`
    email             | password             | expected
    ${users[0].email} | ${users[0].password} | ${201}
    ${users[1].email} | ${users[1].password} | ${201}
    ${users[2].email} | ${users[2].password} | ${201}
  `('success signup users', async ({ email, password, expected }) => {
    await request(app)
      .post('/user/signup')
      .send({ email, password })
      .expect(expected)
  })

  test.each`
    email                 | password       | expected
    ${'mobin3@gmail.com'} | ${undefined}   | ${400}
    ${'mobingmail.com'}   | ${'mobin1234'} | ${400}
  `('failure signup users', async ({ email, password, expected }) => {
    // required field missed or invalid email
    await request(app)
      .post('/user/signup')
      .send({ email, password })
      .expect(expected)
  })
})

describe('login tests', () => {
  test('success login', async () => {
    const { body } = await request(app)
      .post('/user/login')
      .send({
        email: users[0].email,
        password: users[0].password
      })
      .expect(200)

    // read user profile
    await request(app)
      .get('/user/me')
      .set('Authorization', `Bearer ${body.token}`)
      .send()
      .expect(200)
  })

  test('failure login invalid password', async () => {
    await request(app)
      .post('/user/login')
      .send({
        email: users[0].email,
        password: 'mobin12324'
      })
      .expect(400)
  })
})

describe('edit user profile tests', () => {
  test('success edit user profile', async () => {
    const { body: user } = await request(app)
      .patch('/user/me')
      .set('Authorization', `Bearer ${await db.getUserToken(users[2].email)}`)
      .send({
        name: 'mobin',
        email: 'devmobin@gmail.com'
      })
      .expect(200)

    users[2].email = user.email
    users[2].name = user.name
  })

  test.each`
    invalidToken | update                    | expected
    ${''}        | ${{ location: 'tehran' }} | ${400}
    ${'w'}       | ${{ name: 'nima' }}       | ${401}
  `('failure edit user profile', async ({ invalidToken, update, expected }) => {
    const token = await db.getUserToken(users[2].email)
    await request(app)
      .patch('/user/me')
      .set('Authorization', `Bearer ${token}${invalidToken}`)
      .send(update)
      .expect(expected)
  })
})

// // logout user
// test('success logout user', async () => {
//   await request(app)
//     .get('/user/logout')
//     .set('Authorization', `Bearer ${token}`)
//     .expect(200)

//   // login again for logoutAll tests
//   const response = await request(app)
//     .post('/user/login')
//     .send({
//       email: 'devmobin@gmail.com',
//       password: 'mobin1234'
//     })

//   token = response.body.token
// })

// test('failure logout anAuthenticated user', async () => {
//   await request(app)
//     .get('/user/logout')
//     .expect(401)

//   await request(app)
//     .get('/user/logout')
//     .set('Authorization', `Bearer ${token}w`)
//     .expect(401)
// })

// test('success logout user from all devices', async () => {
//   await request(app)
//     .get('/user/logoutAll')
//     .set('Authorization', `Bearer ${token}`)
//     .expect(200)

//   // login again for delete user tests
//   const response = await request(app)
//     .post('/user/login')
//     .send({
//       email: 'devmobin@gmail.com',
//       password: 'mobin1234'
//     })

//   token = response.body.token
// })

// // delete user profile
// test('success delete user', async () => {
//   await request(app)
//     .delete('/user/me')
//     .set('Authorization', `Bearer ${token}`)
//     .expect(200)

//   const user = await User.findById(id)
//   expect(user).toBeNull()
// })

// test('failure delete anAuthenticated user', async () => {
//   await request(app)
//     .delete('/user/me')
//     .expect(401)
// })
