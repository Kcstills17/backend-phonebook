const express = require('express')
const morgan = require('morgan')
require('dotenv').config()
const cors = require('cors')



const Person = require('./models/person') 
const requiredTime = require('./formatTime')
const app = express()


app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

// ✅ Define custom morgan token AFTER express.json()
morgan.token('body', (req) => (req.method === 'POST' ? JSON.stringify(req.body) : ''))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// ✅ ROUTES

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then((persons) => res.json(persons))
    .catch((error) => res.status(500).json({ error: 'Failed to fetch persons' }))
})

app.get('/api/persons/info', (req, res) => {
  Person.countDocuments({}).then((count) => {
    res.send(
      `<div>Phonebook has info for ${count} people</div><div>${requiredTime.formatDate()}</div>`
    )
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) res.json(person)
      else res.status(404).end()
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id) // ✅ FIX: capitalization of `findByIdAndRemove`
    .then(() => res.status(204).end())
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'Content Missing' })
  }

  // ✅ FIX: Cannot use `.some()` on Mongoose model directly; must query the DB
  Person.findOne({ name: body.name })
    .then((existing) => {
      if (existing) {
        return res.status(400).json({ error: 'Name is already included. Please add a new name.' })
      }

      const person = new Person({
        name: body.name,
        number: body.number,
      })

      return person.save()
    })
    .then((savedPerson) => {
      if (savedPerson) res.json(savedPerson)
    })
    .catch((error) => next(error))
})

// ✅ Unknown endpoint handler (optional)
app.use((req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
})

// ✅ Error handler (for .catch(next) usage)
app.use((error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  next(error)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})