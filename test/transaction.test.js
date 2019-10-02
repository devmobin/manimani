const db = require('./fixtures/db')
const app = require('../src/app')
const request = require('supertest')

const user = {
  name: 'mobin',
  email: 'mobin@gmail.com',
  password: 'mobin1234'
}

const transactions = [
  {
    title: 'project',
    type: 'income',
    amount: 2000
  },
  {
    title: 'salary',
    type: 'income',
    amount: 5000
  },
  {
    title: 'buy car',
    type: 'expense',
    amount: 3000
  },
  {
    title: 'new iPhone',
    type: 'expense',
    amount: 1000
  }
]

beforeAll(async () => {
  // before test transactions, create new user
  await request(app)
    .post('/user/signup')
    .send(user)
})

afterAll(async () => {
  await db.cleanupDatabase()
})

describe('create new transactions', () => {
  test.each`
    transaction        | expected
    ${transactions[0]} | ${201}
    ${transactions[1]} | ${201}
    ${transactions[2]} | ${201}
    ${transactions[3]} | ${201}
  `('success create new transactions', async ({ transaction, expected }) => {
    const { body } = await request(app)
      .post('/transaction/new')
      .set('Authorization', `Bearer ${await db.getUserToken(user.email)}`)
      .send(transaction)
      .expect(expected)

    transactions.forEach((transact, index) => {
      if (body.title === transact.title) {
        transactions[index].id = body._id
      }
    })
  })

  test('failure create new transaction anAuthenticated user', async () => {
    await request(app)
      .post('/transaction/new')
      .send(transactions[1])
      .expect(401)
  })
})

// // read all transactions
// test('success read all transactions', async () => {
//   await request(app)
//     .get('/transaction/me')
//     .set('Authorization', `Bearer ${token}`)
//     .send()
//     .expect(200)
// })

// test('failure read all transactions anAuthenticated user', async () => {
//   await request(app)
//     .get('/transaction/me')
//     .send()
//     .expect(401)
// })

// // read one transaction
// test('success read one transaction', async () => {
//   await request(app)
//     .get(`/transaction/${transactionId}`)
//     .set('Authorization', `Bearer ${token}`)
//     .send()
//     .expect(200)
// })

// test('failure read one transaction', async () => {
//   await request(app)
//     .get(`/transaction/${transactionId}`)
//     .send()
//     .expect(401)

//   await request(app)
//     .get(`/transaction/${transactionId}q`)
//     .set('Authorization', `Bearer ${token}`)
//     .send()
//     .expect(500)
// })

// // editing transactions
// test('success edit transaction', async () => {
//   await request(app)
//     .patch(`/transaction/${transactionId}`)
//     .set('Authorization', `Bearer ${token}`)
//     .send({
//       amount: 2500
//     })
//     .expect(200)
// })

// test('failure edit transaction', async () => {
//   await request(app)
//     .patch(`/transaction/${transactionId}`)
//     .send({
//       amount: 2500
//     })
//     .expect(401)

//   await request(app)
//     .patch(`/transaction/${transactionId}`)
//     .set('Authorization', `Bearer ${token}`)
//     .send({
//       name: 'finish this node project'
//     })
//     .expect(400)
// })

// // delete transaction
// test('failure delete transaction', async () => {
//   await request(app)
//     .delete(`/transaction/${transactionId}`)
//     .send()
//     .expect(401)
// })

// test('success delete transaction', async () => {
//   await request(app)
//     .delete(`/transaction/${transactionId}`)
//     .set('Authorization', `Bearer ${token}`)
//     .send()
//     .expect(200)
// })
