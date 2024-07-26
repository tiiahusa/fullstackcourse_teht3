const http = require('http')
const express = require('express')
const app = express()

app.use(express.json())

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

// info sivu
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

/* Tämä käsittelee kaikki GEt-pyynnöt, joiden osoite on http://localhost:3001/api/notes/MITÄ_VAAN
app.get('/api/notes/:id', (request, response) => {
    //Poimitaan parametri id http get-pyynnöstä:
    const id = request.params.id
    // Etsitään oikea muistiinpano ja palautetaan se
    const note = notes.find(note => note.id === id)
    //Tarkistus vielä, että öytyykö note ja jos ei niin palautetaan virhe
    if (note) {
        response.json(note)
      } else {
        response.status(404).end() // End perässä ilmoittamassa, että mitään dataa ei tule
      }
  })

  // Resurssin poisto
app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)
  //Palauttaa 204 koodin riippumatta siitä poistetaanko jotain vai ei. eikä ole suoraa sääntöä olemassa pitäiskö
  //käyttää 204 vai 404 koodia niissä tilanteissa 
    response.status(204).end()
  })

//Uudelle muistiinpanolle tarvitaan uniikki id ja se tehdään etsimällä suurin id ja lisäämällä siihen 1
  const generateId = () => {
    const maxId = notes.length > 0
    //taulukko ei kelpaa Math.maxille arcoksi, joten ... -avulla muutetaan taulukko yksittäisiksi luvuiksi, jotta voidaan käyttää komentoa
      ? Math.max(...notes.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
  }

  //POST-pyyntö
  app.post('/api/notes', (request, response) => {
    // Poimitaan body tiedot käsittelyyn
    const body = request.body
  
    // Tarkistetaan, että content-arvo löytyy
    if (!body.content) {
      return response.status(400).json({ //muista return, muuten kodi jatkaa loppuun ja muistiinpano tallentuu
        error: 'content missing' 
      })
    }
  // luodaan note ja jos important arvoa ei ole, se on oletusarvoisesti false
    const note = {
      content: body.content,
      important: body.important || false,
      id: generateId(), //generoidaan id ylemmän komponentin avulla
    }
  // Lisätään muistiinpano listaan
    notes = notes.concat(note)
  // vastataan muistiinpanon tiedoilla pyyntöön
    response.json(note)
  })

NÄMÄ ILMAN EXPRESS-laajennusta! ja toimivat oli polku mikä tapahda, kunhan alun osoite on ok
Luodaan http-metodilla createServer web-palvelin ja sille annetaan tapahtumakäsittelijä
//Eli {} sulkeiden sisässä oleva koodi, joka suoritetaan aina kun http://localhost:3001/ 
//HTTP-pyyntö suoritetaan
const app = http.createServer((request, response) => {
    //vastataan statuskoodilla 200 "pyyntö ok"
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  //Sivun sisällöksi asetetaan yllä annetut muistiinpanot ja muutetaan ne JSON-muotoon:
  response.end(JSON.stringify(notes))
})

/ Luodaan http-metodilla createServer web-palvelin ja sille annetaan tapahtumakäsittelijä
//Eli {} sulkeiden sisässä oleva koodi, joka suoritetaan aina kun http://localhost:3001/ 
//HTTP-pyyntö suoritetaan
const app = http.createServer((request, response) => {
    //vastataan statuskoodilla 200 "pyyntö ok"
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  //Sivun sisällöksi merkkijono Hello World:
  response.end('Hello World')
})*/

//Nämä rivit sitovat muuttujan app kuuntelemaan nimenomaan 3001 portin pyyntöjä
const PORT = 3001
app.listen(PORT)


console.log(`Server running on port ${PORT}`)