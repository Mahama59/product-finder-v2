const jwt = require("jsonwebtoken");

const JWT_SECRET =
    process.env.JWT_SECRET || "product-finder-secret";


function protect(req, res, next) {

    const header =
        req.headers.authorization;


    if (!header) {

        return res.status(401).json({

            success:false,

            message:"Authorization token required"

        });

    }


    if (!header.startsWith("Bearer ")) {

        return res.status(401).json({

            success:false,

            message:"Invalid authorization format"

        });

    }


    const token =
        header.split(" ")[1];


    try {

        const decoded =
            jwt.verify(
                token,
                JWT_SECRET
            );


        req.user = decoded;


        next();


    } catch(error) {


        return res.status(401).json({

            success:false,

            message:"Token expired or invalid"

        });


    }

}


module.exports = protect;
