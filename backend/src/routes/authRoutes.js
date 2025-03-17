import express from 'express';
import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign(
        {userId}, process.env.JWT_SECRET, {expiresIn: "15d"},
    )
}

router.post("/register", async (req, res)=>{
    try {
        const {email, username, password} = req.body;

        if(!username || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        if(password.length < 6){
            return res.status(400).json({message: "Password should be at least 6 characters long"})
        }

        if(username.length < 3){
            return res.status(400).json({message: "Username should be at least 3 characters long"})
        }

        //check if user already exists
        // const existingUser = await User.findOne({$or: [{email}, {username}]});
        // if(existingUser){
        //     return res.status(400).json({msg: "User already exists"});
        // }
        
        const existingEmail = await User.findOne({email}); //finding a user in the database with the input email
        if(existingEmail) {
            return res.status(400).json({msg: "Email already exists"})
        }

        const existingUsername = await User.findOne({username});
        if(existingUsername) {
            return res.status(400).json({msg: "Username already exists"});
        }


        //get random avatar
        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;




        const user = new User ({
            email,
            username,
            password,
            profileImage,
        })

        await user.save(); //user created, data stored to db;

        //after creating the account (registering), generate the jwt and send token to the client
        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: {
                _id: user._id,
                username : user.username,
                email: user.email,
                profileImage: user.profileImage
            }
        })

    } catch (error) {
        console.log("Error in register route", error);
        res.status(500).json({message: "Internal Server error"});
    }
})

// router.post("/login", async (req,res)=>{
//     res.send("login");
// })

export default router;