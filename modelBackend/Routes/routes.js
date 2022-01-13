const express = require("express")
const{Signup,Login} = require("../controllers/authController.js")
const {applyToJob,myApplications,withDrawApplication} = require("../controllers/employeeController")
const {postJob,getAppliedEmployees,getSelectedEmployees} = require("../controllers/employerController")
const router = express.Router()

router.post("/signup",Signup) 
router.post("/login",Login)
//emplyee part 
router.post("/employee/applytojob",applyToJob),
router.get("/employee/:id/myapplications",myApplications)
router.delete("/employee/myapplications/:id/",withDrawApplication)

//employer part 
router.post("/employer/postjob",postJob)
router.get("/employer/getappliedemployees/:id",getAppliedEmployees)
router.get("/employer/selectedemployees/:id",getSelectedEmployees)
module.exports = router
