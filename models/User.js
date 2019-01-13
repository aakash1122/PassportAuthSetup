var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  email:{
    type:String
  },
  username:{
    type: String,
  },
  password:{
    type:String
  }
})

module.exports = mongoose.model('user',userSchema)
