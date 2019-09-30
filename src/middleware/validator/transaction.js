const createNewTransaction = async ({ body }, res, next) => {
  if (!body.title || !body.amount || !body.type) {
    return res
      .status(400)
      .send({ error: 'please enter all required fields [type, title, amount]' })
  }

  if (body.type !== 'income' && body.type !== 'expense') {
    return res
      .status(400)
      .send({ error: 'please enter valid type [income, expense]' })
  }

  next()
}

module.exports = {
  createNewTransaction
}
