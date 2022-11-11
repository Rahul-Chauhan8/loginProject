const mongoose = require('mongoose');
const studentModel = require('../models/studentModel')

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};




//==================================================== create Student ============================================================

let createStudent = async (req, res) => {
    try {
        let data = req.body;
        data.userId = req.params.userId
        let { name, subject, marks } = data;

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: "Please Provide Student Details" });
        }

        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: "Name is required" });
        }

        if (!isValid(subject)) {
            return res.status(400).send({ status: false, message: "Subject is required" });
        }

        if (!isValid(marks)) {
            return res.status(400).send({ status: false, message: "Marks is required" });
        }

        let student = await studentModel.findOne({ name, subject });
        if (student) {
            student.marks = student.marks + marks
            await student.save()
            return res.status(200).send({ status: true, message: "marks updated", data: student });
        }
     
        //----------------------------- Creating student Data -----------------------------//
        const studentCreated = await studentModel.create(data)
        return res.status(201).send({ status: true, message: "Student Created Successfully", data: studentCreated })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
};




//========================================================== Get Students ===========================================================


let getStudent = async (req, res) => {
    try {
        let { name, subject } = req.query

        let filter = { isDeleted: false, userId: req.params.userId }

        if (name) {
            filter.name = name
        }
        if (subject) {
            filter.subject = subject
        }

        const student = await studentModel.find(filter)
        if (student.length === 0) {
            return res.status(404).send({ status: false, msg: "No student Data Found" });
        }
        return res.status(200).send({ status: true, message: "Success", data: student });
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}




//======================================================== Update Student ===========================================================


let updateStudent = async (req, res) => {
    try {
        let data = req.body;
        let studentId = req.params.studentId

        if (!mongoose.isValidObjectId(studentId)) {
            return res.status(400).send({ status: false, message: "Please Provide valid student id" });
        }

        let { name, subject, marks } = data;

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: "Please Provide Student Detail to update" });
        }
        if (name) {
            if (!isValid(name)) return res.status(400).send({ status: false, message: "name is required" })
        }
        if (subject) {
            if (!isValid(subject)) return res.status(400).send({ status: false, message: "subject is required" })
        }
        if (marks) {
            if (!isValid(marks)) return res.status(400).send({ status: false, message: "marks is required" })
        }

        let updatedDetail = await studentModel.findOneAndUpdate({ isDeleted: false, _id: studentId }, data, { returnDocument: "after" });
        return res.status(200).send({ status: true, message: "Successfully updated", data: updatedDetail });
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
};




//===================================================== delete Students ===============================================================


let deleteStudent = async (req, res) => {
    try {
        let Id = req.params.studentId
        if (!mongoose.isValidObjectId(Id)) {
            return res.status(400).send({ status: false, message: "Please Provide valid student id" });
        }

        let deletedData = await studentModel.findOneAndUpdate({ _id: Id, isDeleted: false }, { $set: { isDeleted: true } })
        if(deletedData) {
        return res.status(200).send({ status: true, message: `${deletedData.name}'s data Successfully Deleted.` })
        }else{
            return res.status(404).send({status:false, message:'this student had already been deleted'})
        }
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
};




module.exports = { createStudent, updateStudent, getStudent, deleteStudent };