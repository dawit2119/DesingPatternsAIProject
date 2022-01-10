const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserModel = require("./user")
const EmployerModel = UserModel.discriminator("Employer",
  new Schema({
      myJobs:[
          {
              type:Schema.Types.ObjectId,
              ref:'Job'
          }
      ]
  })
)
module.exports = EmployerModel