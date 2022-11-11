const express = require('express');
const router = express.Router();
const { authentication, authorization } = require('../middleware/auth')
const { createUser, userLogin } = require('../controllers/userController')
const { createStudent, getStudent, deleteStudent, updateStudent } = require('../controllers/studentController');


//----------------------------- User's API -----------------------------//

router.post('/register', createUser)
router.post('/login', userLogin)

router.post('/user/:userId/student', authentication, authorization, createStudent)
router.get('/user/:userId/student', authentication, authorization, getStudent)
router.put('/user/:userId/student/:studentId', authentication, authorization, updateStudent)
router.delete('/user/:userId/student/:studentId', authentication, authorization, deleteStudent)
 

//----------------------------- For invalid end URL -----------------------------//

router.all('/**', function (req, res) {
    return res.status(400).send({ status: false, message: "Invalid http request" })
})


module.exports = router; 

