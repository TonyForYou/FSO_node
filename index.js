const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(morgan('tiny'))

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-01-10T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-01-10T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-01-10T19:20:14.298Z",
    important: true
  }
]

let phonebook = [
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


app.get('/info', (req, res) => {
  const currentDate = new Date()
  res.send(`<h2>Phonebook has info for ${phonebook.length} people<h2> <h2>${currentDate}<h2>`)

})

app.get('/api/persons', (req, res) => {
  res.json(phonebook)
})



app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id',(req, res)=>{
  const id = Number(req.params.id)
  // search for a specific ID and remove it
  phonebook = phonebook.filter(entry => entry.id !== id)
  res.status(204).end()
})

morgan.token('object', function(req,res){
  return `${JSON.stringify(req.body)}`
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'))

app.post('/api/persons',(req,res)=>{
  const body = req.body
// throw an error if no name or number
  if (!body.name){
    //custom error message
    return res.status(400).json({error: 'name is missing'})
  }

  if (!body.number){
    //custom error message
    return res.status(400).json({error: 'number is missing'})
  }

  if (phonebook.some(entry=>entry.name===body.name)){
    return res.status(400).json({error: 'name must be unique'}) 
  }

  let entry = {
    id: generateId(),
    name: body.name,
    number: body.number,
    }

  phonebook = phonebook.push(entry)
  res.json(entry)
})



app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const entry = phonebook.find(entry=>entry.id == id)
  if(entry){
    res.json(entry)
  } else {
    res.status(404).end()
  }
})



const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})