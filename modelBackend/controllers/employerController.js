const JobModel = require("../models/Job");
const mongoose = require("mongoose");
const EmployerModel = require("../models/employer");
const ApplicationModel = require("../models/application");
const EmployeeModel = require("../models/employee");
const ObjectId = mongoose.Types.ObjectId;

const postJob = async (req, res) => {
  try {
    const job = req.body;
    console.log(typeof job.requirements);
    if (!ObjectId.isValid(job.postedBy))
      return res.status(400).json({ message: "wrong employer id" });
    const employer = await EmployerModel.findById(job.postedBy);
    if (employer) {
      if (!job.requirements || typeof job.requirements !== "object")
        return res.status(401).send("requirements are required");
      const newJob = await JobModel.create(job);
      return res.status(201).json({ newJob });
    } else {
      return res.status(404).json({ message: "Could not find employer" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
const getAppliedEmployees = async (req, res) => {
  console.log("get Applied employees request is comming");
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id))
      return res.status(401).send("Incorrect Object Id");
    const job = await JobModel.findById(id);
    const appliedEmployees = [];
    if (job) {
      const applications = job.applications;
      console.log("applications");
      console.log(applications);
      if (applications.length == 0)
        return res.status(200).json({ applications });
      applications.map(async (app, index) => {
        const application = await ApplicationModel.findById(app);
        const employee = EmployeeModel.findById(application.appliedBy);
        appliedEmployees.push(employee);
        if (index == applications.length - 1) {
          return res.status(200).json({ appliedEmployees });
        }
      });
    } else {
      return res.status(404).send("Job not found");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
const getSelectedEmployees = async (req, res) => {
  try {
    const jobId = req.params.id;
    if (!ObjectId.isValid(jobId))
      return res.status(401).send("Incorrect Job Id");
    const job = await JobModel.findById(jobId);
    if (job) {
      const requiredEmplyees = job.requiredEmployees;
      const applications = await ApplicationModel.find({ appliedFor: jobId });
      if (applications.length == 0)
        return res.status(200).json({ selectedEmployees: [] });
      const sortedApplications = applications.sort(
        (applicationOne, applicationTwo) => applicationTwo - applicationOne
      );

      return res
        .status(200)
        .json({
          selectedEmployees: sortedApplications.splice(0, requiredEmplyees),
        });
    } else {
      return res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = { postJob, getAppliedEmployees, getSelectedEmployees };
