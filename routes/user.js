const express = require('express');
const z = require('zod');
const {userModel} = require('../db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config');

const router = express.Router();

//zod validation
const bodyParsed = z.object({
    username: z.string().email(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string()
});

router.use('/signup', async (req,res)=>{
    //if zod fails
    if(!bodyParsed.success){
        return res.status(411).json({
            message: "Email already taken/incorrect inputs"
        })
    }

    //checking for duplication
    const existingUser =await userModel.findOne({
        username: req.body.username
    })

    if(existingUser){
        res.status(411).json({
            message: "Email already taken/incorrect inputs"
        })
    }

    //creating the user
    const user = await userModel.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })

    //creating token for the users created
    const token = jwt.sign({
        userId: user._id
    },JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })
})

router.use('/signin',(req,res)=>{

})

module.exports = router;