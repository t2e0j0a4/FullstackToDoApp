import {Router} from "express";
import userModel from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "dotenv";
import { body, validationResult } from "express-validator";

env.config();

const router = Router();

// POST : http://localhost:5000/api/v1/users/register - User Registration.
// No Login Required.
router.post('/register', [

    body('email', "Invalid Email...").isEmail(),
    body('password', "Minimum 8 Characters...").isLength({ min: 8 }),

] , async (req,res)=>{

    const {fullName, email, password} = req.body;
    try {

        const errors = validationResult(req);
        let errorsMsg = [];
        errors.array().map((err)=>{
            const {msg, param} = err;
            errorsMsg = [...errorsMsg,{param,alertMsg : msg}];
        })
        
        if (!errors.isEmpty()) {
          return res.status(400).json({
            success: false,
            errors: errorsMsg
          });
        }
        
        let userExistence = await userModel.findOne({email});
        
        if (userExistence) {
            return res.status(200).json({
                success : false,
                alertMsg : "User already Registered..."
            })
        }

        // Hashing Password
        let hashPassword = await bcrypt.hash(password,10);

        let newUser = await userModel.create({
            fullName,
            email,
            password : hashPassword
        })

        // User JWT Token
        const payload = {
            UID : newUser._id
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        const token = jwt.sign(payload,JWT_SECRET);
        
        return res.status(200).json({
            success : true,
            alertMsg : "User Registered Successfully...",
            fullName : fullName,
            token : token
        })

        
    } catch (error) {
        return res.status(500).json({
            success : false,
            alertMsg : "Internal Server Error..."
        })
    }
})

// POST : http://localhost:5000/api/v1/users/login - User Login.
// No Login Required.
router.post("/login", [

    body('email', "Invalid Email...").isEmail(),

] ,async (req, res) => {

    const {email, password} = req.body;
    try {

        const userWithEmail = await userModel.findOne({email});
        if (!userWithEmail) {
            return res.status(400).json({
                success : false,
                alertMsg : "Invalid Credentials..."
            })
        }

        bcrypt.compare(password, userWithEmail.password).then(()=>{

            // User JWT Token
            const payload = {
                UID : userWithEmail._id
            }

            const JWT_SECRET = process.env.JWT_SECRET;
            const token = jwt.sign(payload,JWT_SECRET);

            return res.status(200).json({
                success : true,
                alertMsg : "Login Successfull...",
                fullName : userWithEmail.fullName,
                token : token
            })

        }).catch(()=>{
            return res.status(200).json({
              success: true,
              alertMsg: "Invalid Credentials...",
              token: token,
            });
        })
        
    } catch (error) {
        return res.status(500).json({
          success: false,
          alertMsg: "Internal Server Error...",
        });
    }
  
});

export default router;