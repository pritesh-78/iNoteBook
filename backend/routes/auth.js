const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, validationResult, body } = require('express-validator');
const User = require('../models/User');
const fetchuser = require('../middleware/fetchUser');

const JWT_SECRET = 'Pritisagoodb$oy ';

//------------------ROUTE : 1 ----- Create a user using : POST "/api/auth/createuser" No login required ----------------------

router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid E-mail').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {

    let success = false;


    //if there are errors, return bad request and the errors

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success,errors: errors.array() });
    }

    //----------------one way to store data in database--------------------

    // console.log(req.body);
    // const user = User(req.body);
    // user.save();
    // res.send(req.body);

    //---------------another way to store data in db--------------------

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: 'Sorry , a user with this same email already exists' })
        }
        const salt = await bcrypt.genSalt(10);
        secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        })

        //then and catch is used if async await is not used 

        // .then(user=>res.json(user))
        // .catch(err=>console.log(err));

        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET)
        success = true;
        res.json({ success,authToken });
        // res.json(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }


})

//------------------ ROUTE : 2 ----- Authenticate a user using : POST "/api/auth/login". No Login Required ----------------------

router.post('/login', [
    body('email', 'Enter a valid E-mail').isEmail(),
    body('password', 'Password can not be blank').exists(),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            
            return res.status(400).json({success, error: "Please try to login with correct credentials" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({success, error: "Please try to login with correct credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET)
        success = true;
        res.json({success, authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }

})

//------------------ ROUTE : 3 ----- Get Logged in user details: POST "/api/auth/getuser" . Login required ----------------------

router.post('/getuser', fetchuser ,async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }

})

module.exports = router