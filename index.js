const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('postData', (request, response) => {
  if (request.method !== 'POST') {
    return ''
  }
  return JSON.stringify(request.body)
})
app.use(morgan((tokens, request, response) => {
  return [
    tokens.method(request, response),
    tokens.url(request, response),
    tokens.status(request, response),
    tokens.res(request, response, 'content-length'), '-',
    tokens['response-time'](request, response), 'ms',
    tokens.postData(request, response)
  ].join(' ')
}))

let persons = [
  { 
    id: "1",
    name: "Arto Hellas", 
    number: "040-123456"
  },
  { 
    id: "2",
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    id: "3",
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  { 
    id: "4",
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id) 
  if (person) {
    response.json(person)
  }
  response.status(404).end()
})

app.get('/info', (request, response) => {
  console.log(response.header.Date)
  response.send(`<p>Phonebook has info for ${persons.length} people</p><br/><p>${new Date()}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

const generateId = () => {
  return String(Math.floor(Math.random() * 10000))
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({error: 'name is missing'})
  }
  if(!body.number) {
    return response.status(400).json({error: 'Number is missing'})
  }
  if(persons.some(p => p.name === body.name)) {
    return response.status(400).json({error: 'Name must be unique'})
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = 3002
app.listen(PORT)
console.log(`Server is running on port ${PORT}`)