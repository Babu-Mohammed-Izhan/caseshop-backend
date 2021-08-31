const mongoose = require('mongoose')
const url = "url"

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(() => {
    console.log("connected to MongoDB database")
})
.catch((err) => {
    console.log('error connecting to MongoDB: ', err.message)
})

const phonecaseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    imgUrl:{
        type:String,
        required:true
    }
})

phonecaseSchema.set('toJSON',{
    transform: (document,returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Phonecase', phonecaseSchema)