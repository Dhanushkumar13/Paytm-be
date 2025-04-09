const express = require('express');
const z = require('zod');
const {userModel} = require('../db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config');
const authMiddleware = require('../middleware');

const router = express.Router();

//zod validation
const bodyParsed = z.object({
    username: z.string().email(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string()
});

router.post('/signup', async (req,res)=>{
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

const signinBody = z.object({
    username: z.string().email(),
    password: z.string(),
})

router.post('/signin',async(req,res)=>{
    
    if(!signinBody.success){
        return res.status(411).json({
            message: "Email already taken/incorrect input"
        })
    }

    const user = await userModel.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if(user){
        const token = jwt.sign({
            userId: user._id
        },JWT_SECRET)

    res.json({
        token: token
    })
    return;
    }

    res.status(411).json({
        message: "Error while logging in!"
    })
})

//update
const updateBody = z.object({
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
})

router.put('/',authMiddleware,async(req,res)=>{
    if(!updateBody.success){
        return res.status(411).json({
            message: "Email already taken/incorrect input"
        })
    }

    
    const user = await userModel.updateOne({
    //checks the userId present in the database
        _id: req.userId
    }, req.body);

    res.json({
        message: "Updated successfully"
    })
})

//To filter and find the users

router.get('/bulk', authMiddleware, async(req,res)=>{
    const filter = req.query.filter || "";
    const users = await userModel.find({
        $or: [
            {
                firstName: {$regex : filter}
            },
            {
                lastName: {$regex : filter}
            }
        ],
    })

    res.json({
        user: users.map(u => ({
            username: u.username,
            firstName: u.firstName,
            lastName: u.lastName,
            userId: u._id
        }))  
    })
})

module.exports = router;