const express = require('express');
const { accountModel } = require('../db');
const authMiddleware = require('../middleware');
const mongoose = require('mongoose');

const router = express.Router();

//balance api route
router.get('/balance',authMiddleware,async(req,res)=>{
    const account = await accountModel.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    })
})

//transfer money api
router.post('/transfer',authMiddleware, async(req,res)=>{
    try {
        const session = await mongoose.startSession();

    //start transaction to avoid lose in transaction data
    await session.startTransaction();
    const {amount,to} = req.body;

    const account =  await accountModel.findOne({
        userId: req.userId
    }).session(session);

    if(!account || accountModel.balance < amount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient funds"
        });
    }

    const toAccount = await accountModel.findOne({
        userId: to
    }).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    //Perform transfer
    await accountModel.updateOne({
        userId: req.userId
    },
    {
        $inc:
            {
                balance: -amount
            }
    }
).session(session)

    await accountModel.updateOne({
        userId: to
    },
    {
        $inc:
        {
            balance: amount
        }
    }
).session(session);

    //end transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer succesful"
    });
    } catch (error) {
       console.log(error);
    }
});



module.exports = router;