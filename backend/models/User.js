const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // Makes sure that the email address is unique

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);