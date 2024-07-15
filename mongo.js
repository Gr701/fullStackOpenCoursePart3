const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://fullStack:${password}@cluster0.jvbgpd0.mongodb.net/phonebookDB?
  retryWrites=true&w=majority&appName=cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

if (process.argv.length < 3) {
  console.log('give password as an argument')
  exit(1)
}

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Person = mongoose.model('persons', personSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  new Person({
    name: process.argv[3],
    number: process.argv[4]
  }).save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('wrong ammount of arguments')
}
