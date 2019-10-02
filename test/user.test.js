const db = require('./fixtures/db')
const app = require('../src/app')
const request = require('supertest')
const User = require('../src/model/user')

afterAll(async () => {
  await db.cleanupDatabase()
})

describe('signup tests', () => {
  test.each`
    email                 | password       | expected
    ${'mobin@gmail.com'}  | ${'mobin1234'} | ${201}
    ${'mobin1@gmail.com'} | ${'mobin1234'} | ${201}
    ${'mobin2@gmail.com'} | ${'mobin1234'} | ${201}
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

// // login tests
// test('success login', async () => {
//   const responseLogin = await request(app)
//     .post('/user/login')
//     .send({
//       email: 'mobin@gmail.com',
//       password: 'mobin1234'
//     })
//     .expect(200)

//   // read user profile
//   const response = await request(app)
//     .get('/user/me')
//     .set('Authorization', `Bearer ${responseLogin.body.token}`)
//     .send()
//     .expect(200)

//   token = responseLogin.body.token
//   id = response.body._id
// })

// test('failure login invalid password', async () => {
//   await request(app)
//     .post('/user/login')
//     .send({
//       email: 'mobin@gmail.com',
//       password: 'mobin12324'
//     })
//     .expect(400)
// })

// // edit user profile test
// test('success edit user profile', async () => {
//   const response = await request(app)
//     .patch('/user/me')
//     .set('Authorization', `Bearer ${token}`)
//     .send({
//       name: 'mobin',
//       email: 'devmobin@gmail.com'
//     })
//     .expect(200)

//   expect(id).toEqual(response.body._id)
//   const user = await User.findById(id)
//   expect(user.name).toEqual('mobin')
//   expect(user.email).toEqual('devmobin@gmail.com')
// })

// test('failure edit user profile', async () => {
//   await request(app)
//     .patch('/user/me')
//     .set('Authorization', `Bearer ${token}`)
//     .send({
//       location: 'tehran'
//     })
//     .expect(400)

//   await request(app)
//     .patch('/user/me')
//     .set('Authorization', `Bearer ${token}w`)
//     .send({
//       name: 'mobin'
//     })
//     .expect(401)
// })

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
