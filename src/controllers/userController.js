const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
}

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

exports.userRegistration = async (req, res) => {
    try {
        let userData = req.body
        let {name,password,email} = userData


        if(!isValid(name)){
           return res.status(400).send({status:false, msg:"name is neccessory"})
        }
        if(!isValid(password)){
            return  res.status(400).send({status:false, msg:"password is neccessory"})
        }
        if(!isValid(email)){
            return  res.status(400).send({status:false, msg:"email is neccessory"})
        }

        const salt = await bcrypt.genSalt(10)
        userData.password = await bcrypt.hash(userData.password, salt)

     
        ///<-----------------------------created part ---------------------------------->
        const userCreated = await userModel.create(userData);
        return res.status(201).send({ status: true, message: 'Success', data: userCreated });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};
