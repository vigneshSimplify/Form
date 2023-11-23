const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config();

const URI = process.env.URI

const mongoDB = () =>{
    mongoose.connect(URI)
    .then(()=> console.log(`MongoDB is Connected`))
    .catch((error) => console.log(error))
}

module.exports = mongoDB