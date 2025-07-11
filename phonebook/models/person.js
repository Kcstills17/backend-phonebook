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
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    process.exit(1)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String, 
    minLength: 2
  }, 
  number: String
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('Person', personSchema)

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })

