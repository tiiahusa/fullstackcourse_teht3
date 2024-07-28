//Mongoose käyttöön
const mongoose = require('mongoose')

//Tarkistetaan onko annettu salasana ja lopetetaan ohjelma jos ei
if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

// Salasana poimitaan käynnistyskoodista node mongo.js *salasana*
const password = process.argv[2]

//Tietokannan osoite
const url =
  `mongodb+srv://db_user:${password}@tiiantesti.tzjy0mg.mongodb.net/people?retryWrites=true&w=majority&appName=TiianTesti`

// Avataan yhteys kantaan
mongoose.set('strictQuery', false)
mongoose.connect(url)

//Idn generointi
const generateId = () => {
    return parseInt(Math.random()*100000).toString()
  }

//Määritellään muistiinpanon skeema:
const personSchema = new mongoose.Schema({
  id: String,
  name: String,
  number: String,
})

//Määritellään muistiinpanon model, eli miten oliot tulee kantaan tallettaa:
const Person = mongoose.model('Person', personSchema)

//Jos annettu vain salasana, palautetaan tietokannan oliot
if(process.argv.length == 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
}

//Jos nimi ja numero on annettu:
else if(process.argv.length >= 5){
    //Poimitaan tiedot ja generoidaan id
    const name = process.argv[3]
    const number = process.argv[4]
    const id = generateId()

    //Luodaan modelin avulla skeemaa vastaava person olio
    const person = new Person({
        id : id,
        name: name,
        number: number,
    })
    
    //Tallennetaan metodilla save
    person.save().then(result => { 
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close() // Suljetaan tietokanta
    })

}








