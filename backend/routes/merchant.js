const express = require("express");
const prisma = require("../prismaClient");
const jwt = require("jsonwebtoken");

const router = express.Router();

const JWT_SECRET =
    process.env.JWT_SECRET || "product-finder-secret";


// AUTH MIDDLEWARE
function auth(req,res,next){

    const header =
    req.headers.authorization;


    if(!header){

        return res.status(401).json({
            success:false,
            message:"No token provided"
        });

    }


    const token =
    header.split(" ")[1];


    try{

        const user =
        jwt.verify(
            token,
            JWT_SECRET
        );

        req.user = user;

        next();


    }catch(error){

        return res.status(401).json({
            success:false,
            message:"Invalid token"
        });

    }

}



// GET MERCHANT PRODUCTS

router.get(
"/products",
auth,
async(req,res)=>{

    try{

        const products =
        await prisma.product.findMany({

            where:{
                merchantId:req.user.id
            },

            orderBy:{
                createdAt:"desc"
            }

        });


        res.json({

            success:true,

            count:products.length,

            products

        });


    }catch(error){

        console.error(error);

        res.status(500).json({

            success:false,

            message:"Unable to load products"

        });

    }

});


module.exports = router;