const mongoose =  require('mongoose')

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('connected to mongodb!'))
  } catch (err) {
    console.log(`mongodb connection error: ${err}`)
    process.exit(1);
  }
}

module.exports = connectMongo