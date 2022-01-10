const  mongoose =  require('mongoose')
const Schema = mongoose.Schema

const JobSchema = new Schema({
    jobName:{
        type:String, 
        required:true, 
    },
    jobDescription:{
        type:String, 
        required:true 
    },
    postedBy:{
        type:Schema.Types.ObjectId,
        ref:"Employer",
        required:true,
    },
    availableUntil:{
        type:Date,
        required:true 
    },
    requirements:[{
        type:Object,
        required:true, 
    }],
    requiredEmployees:{
        type:Number,
        required:true
    },
    applications:[
        {
            type:Schema.Types.ObjectId,
            ref:"Application"
        }
    ],
    selectedEmployees:[
        {
            type:Schema.Types.ObjectId,
            ref:"Employee"
        }
    ]
    
})
const JobModel = mongoose.model("Job",JobSchema)
module.exports = JobModel