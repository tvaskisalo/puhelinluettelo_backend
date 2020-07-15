require('dotenv').config()
const mongoose = require('mongoose')

const URL = process.env.URL

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log('Connection success')
    })
    .catch((error) => {
        console.log('Error: ',error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)

module.exports = mongoose.model('Person', personSchema)