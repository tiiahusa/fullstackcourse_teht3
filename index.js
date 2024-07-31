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

// info sivu, palautetaan taulukon koko ja ajanhetki
app.get('/info', async (request, response) => {
  try {
    const count = await Person.countDocuments({});
    response.send(
      `<p>Phonebook has info for ${count} people</p>
      <p>${new Date().toString()}</p>`
    );
  } catch (err) {
    response.status(500).send('Server error');
  }
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
    .catch(error => next(error))
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
  app.post('/api/persons', (request, response, next) => {
    // Poimitaan body tiedot käsittelyyn
    const body = request.body
  // Luodaan Person-tieto
    const num = new Person({
      name: body.name,
      number: body.number,
    })
    //Tallennetaan tieto
    num.save().then(savedNum => { 
      response.json(savedNum)  
    }).catch(error => next(error))
  })
  

//Muistiinpanon päivitys
  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body //poimitaan 
        
    const num = {
      name: body.name,
      number: body.number,
    }
      
  Person.findByIdAndUpdate(request.params.id, num, { new: true })
    .then(updatedPerson => {
      // Jos henkilö löytyy
      if(updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

  app.use(unknownEndpoint)

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }

  app.use(errorHandler)

//Porttitieto haetaan ympäristömuuttujasta
const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
