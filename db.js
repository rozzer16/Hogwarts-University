require('dotenv').config()
const mongoose = require('mongoose');

const connection = mongoose.connect(process.env.MONGO_PORT)
        .then(db => {
            console.log("Database Connected");
            return db;
        }).catch(err => {
            console.log("Connection Error");
            console.log(err)
        })
// mongoose.set("useCreateIndex", true);
module.exports = connection;