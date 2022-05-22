const mongoose = require("mongoose")
const passportLocalMongoose = require('passport-local-mongoose')


const Schema = mongoose.Schema

const Teacher_model = new Schema({
  eid: { type: String, unique: true },
  name: { type: String },
  dob: { type: String },
  spelization: { type: String },
  password: { type: String },
  gender: { type: String },
  bloodGroup: { type: String },
  joiningyear: { type: Number },
  address: { type: String },
  email: { type: String },
  phone: { type: Number }
},{
  collection: 'teachers',
  versionKey: false
})

Teacher_model.plugin(passportLocalMongoose)

const Teacher = mongoose.model("teachers", Teacher_model)

module.exports = Teacher
