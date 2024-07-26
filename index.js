const http = require('http')
const express = require('express')
const app = express()
app.use(express.json())
var morgan = require('morgan') //Otetaan morgan käyttöön
morgan.token('body', (req) => JSON.stringify(req.body)) //Luodaan mukautettu token nimeltä body
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body')) //Valitaan, mitä tietoja morgan antaa


//Kovakoodatut puhelinnumerot:
let numbers = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": "1"
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": "2"
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": "3"
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": "4"
    }
  ]

// info sivu, palautetaan taulukon koko ja ajanhetki
app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${numbers.length} people</p>
    <p>${Date(Date.now())}</p>`
    )
})

// puhelinnumerotiedot
app.get('/api/persons', (request, response) => {
  response.json(numbers)
})

// Yksittäisen ID:n näyttö
app.get('/api/persons/:id', (request, response) => {
    //Poimitaan parametri id http get-pyynnöstä:
    const id = request.params.id
    // Etsitään oikea muistiinpano ja palautetaan se
    const number = numbers.find(number => number.id === id)
    //Tarkistus vielä, että löytyykö numero ja jos ei niin palautetaan virhe
    if (number) {
        response.json(number)
      } else {
        response.status(404).end() // End perässä ilmoittamassa, että mitään dataa ei tule
      }
  })

  // Yksittäisen ID:n poisto
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    numbers = numbers.filter(num => num.id !== id)
    console.log(numbers)
  //Palauttaa 204 koodin riippumatta siitä poistetaanko jotain vai ei. 
    response.status(204).end()
  })

//Uudelle muistiinpanolle tarvitaan uniikki id ja se tehdään etsimällä suurin id ja lisäämällä siihen 1
  const generateId = () => {
    return parseInt(Math.random()*100000)
  }

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
    } else if (numbers.find((num) => num.name == body.name)) { // Tarkistetaan nimi, että löytyykö listasta
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
      }
  // luodaan note ja jos important arvoa ei ole, se on oletusarvoisesti false
    const num = {
      name: body.name,
      number: body.number,
      id: generateId(), //generoidaan id ylemmän komponentin avulla
    }
  // Lisätään muistiinpano listaan
    numbers = numbers.concat(num)

    response.json(num)
  })


const PORT = 3001
app.listen(PORT)

console.log(`Server running on port ${PORT}`)
