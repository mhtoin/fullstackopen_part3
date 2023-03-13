const { response } = require('express')
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())
//app.use(express.static('dist'))

morgan.token('body', req => {
    return JSON.stringify(req.body)
  })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let data = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const generateId = () => {
    return Math.floor(Math.random() * 100000000)
  }

app.get('/api/persons', (req, res) => {
    console.log('retrieving all')
    res.json(data)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = data.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log('delete id is', id)
    data = data.filter(person => person.id !== id)
    console.log(data)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'content missing'
        })
    } else if (data.find(person => person.name == body.name)) {
        return res.status(400).json({
            error: 'Name must be unique'
        })
    }

    
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    data = data.concat(person)
    res.json(person)
})
app.get('/info', (req, res) => {
    const time = new Date()
    const items = data.length
    res.send(`Phonebook has info for ${items} people <br> ${time}`)
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})