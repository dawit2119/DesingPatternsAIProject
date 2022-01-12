const jwt = require("jsonwebtoken")
const bcryptjs = require("bcryptjs")
const UserModel = require("../models/user.js")
const EmployeeModel = require("../models/employee.js")
const EmployerModel = require("../models/employer.js")
const dotenv = require("dotenv")
dotenv.config();

const Signup = async (req, res) => {
  console.log("register request is comming");
  console.log(req.body);
  try {
    const fullName = req.body.fullName;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword
    const role = req.body.role;
    if (!(email && password && fullName)) {
      return res.status(400).send("All inputs are required");
    }
    else if(password !== confirmPassword)return res.status(401).send("password doesn't match")
    const check_user = await UserModel.findOne({ email });

    if (check_user) {
      return res.status(409).json("user already exist!");
    }
    const encryptedPassword = await bcryptjs.hash(password, 10);
    const userInfo = {
      fullName:fullName,
      email: email.toLowerCase(),

      password: encryptedPassword,
      role:role,
    };
    if(role == "employee"){
      const newUser = await EmployeeModel.create(userInfo);
      console.log("Employee Succesfully Registered!");
      return res.status(201).json(newUser);
    }else if(role == "employer"){
      const newUser = await EmployerModel.create(userInfo);
      console.log("Employer Succesfully Registered!");
      return res.status(201).json(newUser);
    }

  } catch (error) {
    console.log(`error: ${error}`);
  }
};


const Login = async (req, res) => {
  console.log("login request is comming");

  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send("All inputs are required");
    }
    const currentUser = await UserModel.findOne({ email });
    console.log(currentUser);
    const check_password = await bcryptjs.compare(
      password,
      currentUser.password
    );
    console.log("currentUser");
    if (currentUser && check_password) {
      const Generate_Token = jwt.sign({ currentUser }, process.env.JWT_SECRET_KEY, {
        expiresIn: "2h",
      });
      res
        .status(200)
        .json({ access_token: Generate_Token, currentuser: currentUser });
    } else {
      return res.status(400).json({ errormessage: "Invalid Credentials" });
    }
  } catch (error_occured) {
    return res.status(403).send("email or password incorrect");
  }
};
module.exports = {Signup,Login}
