const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true
    }
  },
  {
    _id: false
  }
)

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    tokens: [tokenSchema]
  },
  {
    timestamps: true
  }
)

userSchema.methods.toJSON = function() {
  const user = this
  const userObject = user.toObject()

  delete userObject.tokens
  delete userObject.password
  delete userObject.__v

  return userObject
}

const User = mongoose.model('User', userSchema)

module.exports = User
