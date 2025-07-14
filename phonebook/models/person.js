const mongoose = require('mongoose')
require('dotenv').config()

const { MONGO_USER, MONGO_PASSWORD, MONGO_CLUSTER, MONGO_DBNAME } = process.env

if (!MONGO_USER || !MONGO_PASSWORD || !MONGO_CLUSTER || !MONGO_DBNAME) {
  console.error('Missing environment variables. Check your .env file.')
  process.exit(1)
} 


const url = `mongodb+srv://${MONGO_USER}:${encodeURIComponent(MONGO_PASSWORD)}@${MONGO_CLUSTER}/${MONGO_DBNAME}?retryWrites=true&w=majority&appName=${MONGO_CLUSTER.split('.')[0]}`

mongoose.set('strictQuery', false)
mongoose.set('debug', true);

mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
   
    process.exit(1)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String, 
    minLength: [2, 'Name must be of at least 2 or more characters']
  }, 
  number: {
    type: String, 
    validate: {
      validator: function(v) {
        return  /^\d{3}-?\d{3}-?\d{4}$/.test(v); 
      }, 
      message: props => `${props.value} is not a valid phone number!`
    }, 
    required: [true, 'User phone number required.']
  }
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('Person', personSchema)




