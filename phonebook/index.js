
const express = require('express')
const morgan = require('morgan')
const requiredTime = require('./formatTime')
const app = express()
app.use(express.static('dist'))

const cors = require('cors')

app.use(cors())
app.use(express.json()); // parses the incoming JSON body of a POST request and makes it available as request.body.
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body')); 
// Be very cautious as displaying user info is not advised. l


morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
  });



let data  = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => { 
    const maxId = data.length > 0
    ? Math.max(...data.map((d) => Number(d.id)))
    : 0
    const randomNumber = Math.floor(Math.random() * 10000)
    return String(maxId + randomNumber)
}



app.get('/', (request, response) => {
    response.send('<h1> Hello World </h1>')
})

app.get('/api/persons', (request, response) => {
    response.send(data)
})


app.get('/api/persons/info', (request, response) => {
    let amountOfPeople = Object.keys(data).length 
    response.send(
        `<div>Phonebook has room for ${amountOfPeople} people</div>` +
        `<div>${requiredTime.formatDate()}</div>`
      );
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id

    const person = data.filter((d) => d.id == id)

    if (person.length === 0) {
        response.status(404).end()
    } else {
       response.send(person)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Stringg(request.params.id)
     data = data.filter((d) => d.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body;

  
    if (!body.name || !body.number) {
      return response.status(400).json({
        error: 'Content Missing',
      });
    }
  
    if (data.some((d) => d.name.toLowerCase() === body.name.toLowerCase())) {
      return response.status(400).json({
        error: 'Name is already included. Please add a new name ',
      });
    }
  
    const personData = {
      id: generateId(),
      name: body.name,
      number: body.number,
    };
  
    data.push(personData); // Or use concat and make `data` a `let`
  
    response.json(personData);
  });

  const PORT = process.env.PORT || 3001 



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})