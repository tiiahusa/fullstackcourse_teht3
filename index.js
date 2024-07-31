const http = require('http')
const express = require('express')
const app = express()
app.use(express.json())
var morgan = require('morgan') //Otetaan morgan käyttöön
morgan.token('body', (req) => JSON.stringify(req.body)) //Luodaan mukautettu token nimeltä body
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body')) //Valitaan, mitä tietoja morgan antaa
const cors = require('cors')
app.use(cors())
// Frontend käyttöön
app.use(express.static('dist'))
//Otetaan Person model käyttöön
const Person = require('./models/person')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// info sivu, palautetaan taulukon koko ja ajanhetki
app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${numbers.length} people</p>
    <p>${Date(Date.now())}</p>`
    )
})

// puhelinnumerotiedot
app.get('/api/persons', (request, response) => {
  Person.find({}).then(nums => {
    response.json(nums)
  })
})

// Yksittäisen ID:n näyttö
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(nums => {
      response.json(nums)
    })
  })

  //ID:n poisto
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

  //POST-pyyntö
  app.post('/api/persons', (request, response) => {
    // Poimitaan body tiedot käsittelyyn
    const body = request.body

    // Tarkistetaan, että nimi-kenttä löytyy
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    } else if (!body.number) { // Tarkistetaan numero
      return response.status(400).json({ 
        error: 'number missing' 
      })
    } 
  // Luodaan Person-tieto
    const num = new Person({
      name: body.name,
      number: body.number,
    })
    //Tallennetaan tieto
    num.save().then(savedNum => { 
      response.json(savedNum)  
    })
  })

//Muistiinpanon päivitys
  app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body //poimitaan 
        
    const num = {
      name: body.name,
      number: body.number,
    }
      
  Person.findByIdAndUpdate(request.params.id, num)
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
  })

  app.use(unknownEndpoint)

//Porttitieto haetaan ympäristömuuttujasta
const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
