const mongoose = require("mongoose")
const passportLocalMongoose = require('passport-local-mongoose')


const Schema = mongoose.Schema;

const Admin_model = new Schema({
  username: { type: String },
  password: { type: String },
})

Admin_model.plugin(passportLocalMongoose)

const Admin = mongoose.model("admins", Admin_model)

module.exports = Admin
