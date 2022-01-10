const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ApplicationSchema = new Schema({
    appliedBy:{type:Schema.Types.ObjectId,ref:"employee"},
    appliedFor:{type:Schema.Types.ObjectId,ref:"Job"},
    status:{type:String,default:"Applied"},
    seen:{type:Boolean,default:false},
    proposal:[{type:String,required:true}],
    handled:{type:Boolean,default:false},
    applicationScore:{type:Number,default:0}
})
const ApplicationModel = mongoose.model("Application",ApplicationSchema)

module.exports = ApplicationModel