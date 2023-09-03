const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const { UserModel } = require("../models/userModel");
const { BlackModel } = require("../models/blacklistModel");

const userRouter = express.Router();

userRouter.post("/register",async(req,res)=>{
    const {username,email,pass} = req.body;
    try {
       let user = await UserModel.findOne({email});
       if(!user){
        bcrypt.hash(pass,5,async(err,hash)=>{
            if(err){
                return res.status(400).json({"msg":"Something Went Wrong, Try again..."})
            }else{
                let user = new UserModel({username,email,pass:hash});
                await user.save()
                return res.status(201).json({"msg":"Account created Successfully!!"})
            }
        })
       }else{
        return res.status(400).json({"msg":"This email is already registered!!"})
       }
    } catch (error) {
        return res.status(500).json({"msg":"Internal Server Error, Try Again..."})
    }
})


userRouter.post("/login",async(req,res)=>{
    const {email,pass} = req.body;
    try {
        let user = await UserModel.findOne({email});
        if(user){
            bcrypt.compare(pass,user.pass,async(err,result)=>{
                if(result){
                    let token = jwt.sign({userId:user._id,name:user.username},"manikant",{expiresIn:"2d"});
                    // res.cookie("token",token);
                    // res.cookie("name",user.username);
                    res.status(200).json({"msg":"Logged in successfully!!",token,name:user.username});

                    setTimeout(async () => {
                        try {
                          const blackToken = new BlackModel({ token: token });
                          await blackToken.save();
                          res.clearCookie()
                        } catch (error) {
                        }
                      }, 2 * 24 * 60 * 60 * 1000);
                }else{
                    return res.status(400).json({"msg":"Your Password is Wrong!!"})
                }
            })
        }else{
            return res.status(400).json({"msg":"Your email is not exists or wrong!!"})
        }
    } catch (error) {
        return res.status(500).json({"msg":"Internal Server Error, Try Again..."})
    }
})

userRouter.post("/logout",async(req,res)=>{
    let {token} = req.body;
    console.log(req.body);
    try {
        if(token){
            const blackToken = new BlackModel({ token: token });
            await blackToken.save();
            // res.clearCookie()
            res.status(200).send({"msg":"Logged out successfully!!"})
        }else{
            res.status(400).send({"msg":"Something went wrong!!"})
        }
    } catch (error) {
        res.status(500).send({"msg":"Server Internal Error, Try again..."})
    }
})


module.exports = {userRouter}