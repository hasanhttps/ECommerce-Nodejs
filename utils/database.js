const mongoose = require("mongoose")

const connectDb = () => {
  try{
    mongoose.connect(process.env.DB_URL)
    console.log("Connected to DB")
  }
  catch(error){
    console.error("Failed to connect DB",error)
  }
}
 
  module.exports.connectDb = connectDb