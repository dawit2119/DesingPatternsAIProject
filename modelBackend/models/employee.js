const mongoose = require("mongoose")
const Schema = mongoose.Schema
const UserModel = require("./user")

const EmployeeModel = UserModel.discriminator("Employee",
 new Schema({
     myApplications:[
         {type:Schema.Types.ObjectId,ref:"Application"} 
     ]
 })
)
module.exports = EmployeeModel