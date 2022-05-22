const mongoose = require("mongoose")
const passportLocalMongoose = require('passport-local-mongoose')

const Schema = mongoose.Schema

const Student_model = new Schema({
  uid: { type: String , unique: true},
  name: { type: String },
  dob: { type: String },
  course: { type: String },
  password: { type: String },
  gender: { type: String },
  bloodGroup: { type: String },
  admission_year: { type: Number },
  address: { type: String },
  email: { type: String },
  marks: [],
  section: { type: String },
  cgpa: { type: Number },
  sgpa: { type: Array },
  phone: { type: Number },
  semester: { type: String },
},{
  collection: 'students',
  versionKey: false
})

Student_model.plugin(passportLocalMongoose)

const Student = mongoose.model("students", Student_model)

module.exports = Student