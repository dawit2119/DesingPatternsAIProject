const ApplicationModel = require("../models/application");
const mongoose = require("mongoose");
const JobModel = require("../models/Job");
const { trainModel, runModel } = require("./recruimentController");
const EmployeeModel = require("../models/employee");

const applyToJob = async (req, res) => {
  const { appliedBy, appliedFor } = req.body;
  try {
    const ObjectId = mongoose.Types.ObjectId;
    if (!ObjectId.isValid(appliedBy))
      return res.status(401).json({ message: "Invalid employeeId" });
    else if (!ObjectId.isValid(appliedFor))
      return res.status(401).json({ message: "Invalid Job Id" });
    const ifExists = await ApplicationModel.findOne({ appliedBy });
    if (ifExists)
      return res
        .status(401)
        .send("You have already applied for this position!");
    const user = await EmployeeModel.findById(appliedBy);
    const job = await JobModel.findById(appliedFor);
    if (user && job) {
      if (job.requirements.length < 3)
        return res
          .status(401)
          .json({ message: "The Job's requirements are not complete" });
      const requirements = job.requirements;
      const proposals = req.body.proposal;
      if (!proposals)
        return res.status(401).send("please provide your proposals");
      let applicationScore = 0;
      const trainingData = [];
      requirements.map((requirement) =>
        trainingData.push({
          input: requirement.input,
          output: requirement.output,
        })
      );
      trainModel(trainingData);
      proposals.map((proposal) => {
        let score = runModel(proposal, trainingData).percentage;

        applicationScore += (score * 100) / proposals.length;
      });
      const application = req.body;
      console.log("application");
      console.log(application);
      application.applicationScore = applicationScore;
      const newApplication = await ApplicationModel.create(application);
      job.applications.push(newApplication);
      await job.save();
      user.myApplications.push(newApplication)
      await user.save()
      return res.status(201).json({ newApplication });
    } else {
      return res.status(404).json({ message: "user or job not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
const myApplications = async (req, res) => {
  console.log("my Applications request is comming");
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(409).json({ message: "wrong id input" });
    const user = await EmployeeModel.findById(id)
    if(user){
      const myApplications = user.myApplications
      const applications = []
      if(myApplications.length == 0)return res.status(200).json({myApplications})
      myApplications.map(async(application,index)=>{
          const app = await ApplicationModel.findById(application)
          applications.push(app)
          if(index == myApplications.length - 1){
            return res.status(200).json({myApplications:applications})
          }
      })
    }else{
      return res.status(404).send("user not found")
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

const withDrawApplication = async (req, res) => {
  try {
    const id = req.params.id;
    const appliedBy = req.body.appliedBy;
    if (
      !mongoose.Types.ObjectId.isValid(id) &&
      !mongoose.Types.ObjectId.isValid(id)
    )
      return res.status(401).send("wrong application or user id");
    const application = await ApplicationModel.findById(id);
    console.log(application);
    if (application.appliedBy != appliedBy){
      return res
        .status(401)
        .json({ message: "you are not applied this application" });}
    else{await ApplicationModel.findByIdAndDelete(id);
    return res.status(204).send("your application withdrawn successfully" );}
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
module.exports = { applyToJob, myApplications, withDrawApplication };
