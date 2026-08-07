
const jwt = require("jsonwebtoken");

const JWT_SECRET =
process.env.JWT_SECRET || "product-finder-secret";


function protect(req,res,next){

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

        const decoded =
        jwt.verify(
            token,
            JWT_SECRET
        );


        req.user = decoded;


        next();


    }catch(error){

        return res.status(401).json({
            success:false,
            message:"Invalid token"
        });

    }

}


module.exports = protect;
