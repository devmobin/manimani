const express = require('express')

const User = require('../model/user')
const Transaction = require('../model/transaction')
const validator = require('../middleware/validator/transaction')

const router = express.Router()

router.post(
  '/new',
  validator.createNewTransaction,
  async ({ body, user }, res) => {
    const transaction = new Transaction({ ...body, owner: user.id })

    try {
      await transaction.save()

      res.status(201).send(transaction)
    } catch (e) {
      res.status(500).send()
    }
  }
)

router.get('/me', async ({ user }, res) => {
  try {
    await user
      .populate({
        path: 'transactions'
      })
      .execPopulate()

    res.status(200).send(user.transactions)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/:id', async ({ user, params }, res) => {
  const _id = params.id

  try {
    const transaction = await Transaction.findOne({ _id, owner: user._id })

    if (!transaction) {
      return res.status(404).send()
    }

    res.status(200).send({ transaction })
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router
