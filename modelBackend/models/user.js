const  mongoose = require('mongoose')
const options = {
  discriminatorKey: 'userIs', 
  collection: 'users', 
};


const UserFields = {

  fullName: {
    type: String,
    default: null,
    required: true,
  },

  email: {
    type: String,
    default: null,
    required: true,  
  },

  password: {
    type: String,
    default: null,
    required: true,
  },
  role: {
    type: String,
    default: null,
    required: true,
  },
};


const UserSchema = new mongoose.Schema(UserFields ,options ,{timestamps:true});
const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel