require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person')


app.use(express.json())
var morgan = require('morgan')
const { response } = require('express')

morgan.token('custom', function getH (req) {
    if(req.method == 'POST') {
        return JSON.stringify(req.body)
    }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :custom', 'common'))
app.use(cors())
app.use(express.static('build'))

let persons = [
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 1
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 2
      },
      {
        "name": "Ada LoveLace",
        "number": "123",
        "id": 3
      }
]

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if(!body.name) {
        return res.status(400).json({
            error: 'name is missing'
        })
    }
    
    if(!body.number) {
        return res.status(400).json({
            error: 'number is missing'
        })
    }

    //if(persons.filter(per => per.name === person.name)[0]) {
    //    return res.status(400).json({
    //        error: 'name is already in the list'
    //    })
    //}

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        console.log(JSON.stringify(savedPerson))
        res.json(savedPerson)
    })
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
})

app.get('/info', (req, res) => {
    res.send(
        `<h4>Phonebook has ${persons.length} numbers</h4>
        <p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    Person.findById(req.params.id)
        .then(person => {
            if(person) {
                res.json(person)
            } else {
                res.status(404).end()
            }

        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})
const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)