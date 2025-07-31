const express = require('express');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken')

const router = express.Router();


router.post('/register',async (req,res)=>{
    const { username,password } = req.body
    const isUserAlreadyExists =await userModel.findOne({
        username
    })
    if(isUserAlreadyExists){
        return res.status(409).json({
            message:"username already in use"
        })
    }

    const user =await userModel.create({
        username,password
    })

    // JWT
    const token = jwt.sign({
        id:user._id,
    },process.env.JWT_SECRET)

    res.cookie("token",token,{
        expires: new Date(Date.now() + 1000*60*60*24*7),  // 7 days
    })

    res.status(201).json({
        message: "user registered successfully",
        user
    })
})

router.post('/login',async (req,res)=>{
    const { username,password } = req.body

    const user =await userModel.findOne({
        username:username
    })
    if(!user){
        return res.status(401).json({
            message: "invalid username"
        })
    }

    const isPasswordValid = password == user.password
    if(!isPasswordValid){
        return res.status(401).json({
            message: "invalid password"
        })
    }
    const token = jwt.sign({
        id:user._id,
    },process.env.JWT_SECRET)

    res.cookie("token",token,{
        expires: new Date(Date.now() + 1000*60*60*24*7),  // 7 days
    })

    res.status(200).json({
        message: "user loggedIn successfully"
    })
})

router.get('/user',async (req,res)=>{
    const { token } = req.cookies
    
    if(!token){
        return res.status(401).json({
            message:"unautharized"
        })
    }
    try{
       const decoded = jwt.verify(token,process.env.JWT_SECRET)

       const user = await userModel.findOne({
        _id:decoded.id
       }).select("-password")   //.lean()   we can also use lean here

       res.status(200),express.json({
        message:"user data fetch successfully",
        user
       })

    }catch{
        return res.status(401).json({
            message:"unautharized-Invalid token"
        })
    }
})

router.get('/logout',(req,res)=>{
    res.clearCookie("token")

    res.status(200).json({
        message:"user logged out successfully"
    })
})

module.exports = router;