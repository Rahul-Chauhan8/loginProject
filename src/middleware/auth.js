const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const userModel = require('../models/userModel');



/*############################################ authentication ####################################################*/

const authentication = async function (req, res, next) {
    try {
        let token = req.header('Authorization');
        if (!token) {
            return res.status(401).send({ status: false, message: "login is required" })
        }
    
        let splitToken = token.split(" ")
        
        //----------------------------- Token Verification -----------------------------//
        jwt.verify(splitToken[0], "loginApp", (err, decodedtoken) => {
            
            if (err) {
                return res.status(401).send({ status: false, msg: "you are not authenticate" })
            }
            req.token = decodedtoken.userId
            next();
        })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



/*############################################ authorization ####################################################*/

let authorization = async function (req, res, next) {
    try {
        let userId = req.params.userId;
        console.log(userId)
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Please enter valid userId" })
        }

        //----------------------------- Checking if User exist or not -----------------------------//
        let user = await userModel.findById({ _id: userId })
        if (!user) {
            return res.status(404).send({ status: false, message: "User does not exist with this userId" })
        }

        //----------------------------- Authorisation checking -----------------------------//
        if (req.token != user._id) {
            return res.status(403).send({ status: false, message: "Unauthorised access" })
        }
        next()
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { authentication, authorization }