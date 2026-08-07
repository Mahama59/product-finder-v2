const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");

const router = express.Router();

const JWT_SECRET =
    process.env.JWT_SECRET || "product-finder-secret";


// REGISTER
router.post("/register", async (req,res)=>{

    try{

        const {
            name,
            email,
            phone,
            password,
            role
        } = req.body;


        if(!name || !email || !password){

            return res.status(400).json({
                success:false,
                message:"Name, email and password are required"
            });

        }


        const existing =
        await prisma.user.findUnique({
            where:{
                email
            }
        });


        if(existing){

            return res.status(400).json({
                success:false,
                message:"Email already registered"
            });

        }


        const hashedPassword =
        await bcrypt.hash(password,10);


        const user =
        await prisma.user.create({

            data:{

                name,

                email,

                phone,

                password:hashedPassword,

                role: role || "CUSTOMER"

            }

        });


        res.json({

            success:true,

            message:"Account created",

            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role
            }

        });


    }catch(error){

        console.error(error);

        res.status(500).json({

            success:false,

            message:"Registration failed"

        });

    }

});


module.exports = router;

// LOGIN
router.post("/login", async (req,res)=>{

    try{

        const {
            email,
            password
        } = req.body;


        if(!email || !password){

            return res.status(400).json({
                success:false,
                message:"Email and password are required"
            });

        }


        const user =
        await prisma.user.findUnique({

            where:{
                email
            }

        });


        if(!user){

            return res.status(404).json({
                success:false,
                message:"User not found"
            });

        }


        const match =
        await bcrypt.compare(
            password,
            user.password
        );


        if(!match){

            return res.status(401).json({
                success:false,
                message:"Invalid password"
            });

        }


        const token =
        jwt.sign(
            {
                id:user.id,
                email:user.email,
                role:user.role
            },
            JWT_SECRET,
            {
                expiresIn:"7d"
            }
        );


        res.json({

            success:true,

            token,

            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role
            }

        });


    }catch(error){

        console.error(error);

        res.status(500).json({

            success:false,

            message:"Login failed"

        });

    }

});