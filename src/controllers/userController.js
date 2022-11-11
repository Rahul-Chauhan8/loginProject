const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
}



exports.createUser = async (req, res) => {
    try {
        let userData = req.body
        let {name,password,email} = userData

        if (Object.keys(userData).length === 0) {
            return res.status(400).send({ status: false, msg: "Request Cannot Be Empty" })
        }

        if(!isValid(name)){
           return res.status(400).send({status:false, msg:"name is neccessory"})
        }
        if(!isValid(password)){
            return  res.status(400).send({status:false, msg:"password is neccessory"})
        }
        if(!isValid(email)){
            return  res.status(400).send({status:false, msg:"email is neccessory"})
        }
        if(!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
            return res.status(400).send({status:false,msg:"email is not valid"})
        }
        if (!password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9!@#$%^&*]{8,100})$/)) {
            return res.status(400).send({ status: false, msg: "password isn't validate, please make sure length is minimum 8, should have one uppercase and lowercase character and Number also and donot use space and have a special character" })
          }

          let checkEmail = await userModel.findOne({email:email})
          if(checkEmail){
          return  res.status(400).send({status:false,msg:"email is already exist"})
          }
        const salt = await bcrypt.genSalt(10)
        userData.password = await bcrypt.hash(userData.password, salt)

     
       
        const userCreated = await userModel.create(userData);
        return res.status(201).send({ status: true, message: 'Success', data: userCreated });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

//======================================================================= userLogin =============================================

exports.userLogin = async function (req, res) {
    try {
        const data = req.body

        //----------------------------- Validating body -----------------------------//
        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: "Please Enter Login Credentials..." })
        }

        const { email, password } = data

        //----------------------------- Validating Email -----------------------------//
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "Please enter Email Id" })
        }
        if(!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
            return res.status(400).send({status:false,msg:"email is not valid"})
        }

        //----------------------------- Validating Password -----------------------------//
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "Please enter Password" })
        }
        if (!password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9!@#$%^&*]{8,100})$/)) {
            return res.status(400).send({ status: false, msg: "password isn't validate, please make sure length is minimum 8, should have one uppercase and lowercase character and Number also and donot use space and have a special character" })
          }

        //----------------------------- Checking Credential -----------------------------//
        const user = await userModel.findOne({ email })

        if (user) {
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).send({ status: false, message: "Invalid Password Credential" });
            }
        }
        else {
            return res.status(401).send({ status: false, message: "Invalid email Credential" });
        }

        //----------------------------- Token Generation -----------------------------//
        const token = jwt.sign({
            userId: user._id.toString(),
            project: "mock_assignment",
        }, "loginApp")

        res.setHeader("authorization", token)
        const output = {
            userId: user._id,
            token: token
        }
        return res.status(200).send({ status: true, message: "User login successfull", data: output })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
};

