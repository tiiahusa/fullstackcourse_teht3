const mongoose = require('mongoose')
require('dotenv').config()
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI //Haetaan url ympäristömuuttujista .env tiedostosta
console.log(url)

console.log('connecting to', url)  ///Tietokantaan yhteyden otto
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({ //Luodaan skeema henkilötiedolle
  name: String,
  number: String,
})

personSchema.set('toJSON', { //Muutetaan toJSON-vastausta niin, että muutetaan id objektista stringiksi ja poistetaan turhat __v ja objekti-id vastauksesta
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

//Moduulin ulos näkyvä osa määritellään hieman eri tavalla kuin aiemmin. 
module.exports = mongoose.model('Person', personSchema)