const mongoose = require('mongoose')

const url = process.env.MONGODB_URL

mongoose.set('strictQuery', false)
console.log('connecting to', url)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 9,
    validate: {
      validator: v => {
        const divPos = v.indexOf('-')
        if ((divPos === 2 || divPos === 3) && !isNaN(+v.replace('-', ''))) {
          return true
        }
        return false
      },
      message: props => `${props.value} is not a valid phone number`
    }
  },
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = document._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('persons', personSchema)