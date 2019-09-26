const app = require('./app')

app.listen(process.env.PORT, () => {
  console.log(`app is running on port: ${process.env.PORT}`)
})
