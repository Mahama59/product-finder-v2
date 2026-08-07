require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const prisma = require("./prismaClient");
const authRoutes = require("./routes/auth");
const app = express();

const PORT =
    process.env.PORT || 3000;

const FRONTEND_URL =
    process.env.FRONTEND_URL ||
    "https://mahama59.github.io";


// ============================================
// MIDDLEWARE
// ============================================

app.use(
    cors({
        origin: [
            FRONTEND_URL,
            "http://localhost:3000",
            "http://127.0.0.1:3000"
        ],
        credentials:true
    })
);

app.use(
    express.json()
);

app.use("/api/auth", authRoutes);

app.use(
    express.urlencoded({
        extended: true
    })
);


// ============================================
// STATIC FRONTEND
// ============================================

app.use(
    express.static(
        path.join(
            __dirname,
            ".."
        )
    )
);


// ============================================
// API HEALTH CHECK
// ============================================

app.get(
    "/api/health",
    async function(req,res){

        try {

            await prisma.$queryRaw`
                SELECT 1
            `;


            res.json({

                success:true,

                service:
                    "Product Finder API",

                database:
                    "connected",

                status:
                    "online"

            });


        } catch(error){

            res.status(500).json({

                success:false,

                database:
                    "failed",

                error:
                    error.message

            });

        }

    }
);

// ============================================
// PAYSTACK ROUTES
// ============================================

const crypto = require("crypto");

const PAYSTACK_SECRET_KEY =
    process.env.PAYSTACK_SECRET_KEY;


// ============================================
// INITIALIZE PAYMENT
// ============================================

app.post(
    "/api/paystack/initialize",
    async function(req,res){

        try {

            const {
                email,
                amount
            } = req.body;


            if(!email || !amount){

                return res.status(400).json({

                    success:false,

                    message:
                    "Email and amount are required."

                });

            }


            if(!PAYSTACK_SECRET_KEY){

                return res.status(500).json({

                    success:false,

                    message:
                    "Paystack key missing."

                });

            }


            const response =
            await fetch(
                "https://api.paystack.co/transaction/initialize",
                {

                    method:"POST",

                    headers:{

                        Authorization:
                        "Bearer " +
                        PAYSTACK_SECRET_KEY,

                        "Content-Type":
                        "application/json"

                    },


                    body:JSON.stringify({

                        email,

                        amount:
                        Math.round(
                            Number(amount) * 100
                        ),

                        currency:
                        "GHS"

                    })

                }
            );


            const data =
            await response.json();


            if(!response.ok){

                return res.status(400).json({

                    success:false,

                    message:
                    data.message

                });

            }


            await prisma.paymentIntent.create({

                data:{

                    reference:
                    data.data.reference,

                    email,

                    amount:
                    Number(amount),

                    currency:
                    "GHS",

                    status:
                    "PENDING"

                }

            });


            res.json({

                success:true,

                reference:
                data.data.reference,

                authorization_url:
                data.data.authorization_url

            });


        } catch(error){

            console.error(
                error
            );


            res.status(500).json({

                success:false,

                message:
                "Payment initialization failed."

            });

        }

    }
);



// ============================================
// VERIFY PAYMENT
// ============================================

app.get(
    "/api/paystack/verify/:reference",
    async function(req,res){

        try{

            const reference =
            req.params.reference;


            const response =
            await fetch(
                "https://api.paystack.co/transaction/verify/"
                +
                reference,

                {

                    headers:{

                        Authorization:
                        "Bearer " +
                        PAYSTACK_SECRET_KEY

                    }

                }
            );


            const data =
            await response.json();


            res.json({

                success:
                data.status,

                data:
                data.data

            });


        }catch(error){

            console.error(error);


            res.status(500).json({

                success:false,

                message:
                "Verification failed."

            });

        }

    }
);



// ============================================
// PAYSTACK WEBHOOK
// ============================================

app.post(
    "/api/paystack/webhook",
    express.raw({
        type:"application/json"
    }),
    async function(req,res){

        try{

            const signature =
            req.headers[
                "x-paystack-signature"
            ];


            const hash =
            crypto
            .createHmac(
                "sha512",
                PAYSTACK_SECRET_KEY
            )
            .update(req.body)
            .digest("hex");


            if(signature !== hash){

                return res
                .status(401)
                .send("Invalid signature");

            }


            const event =
            JSON.parse(
                req.body.toString()
            );


            console.log(
                "Paystack event:",
                event.event
            );


            res.sendStatus(200);


        }catch(error){

            console.error(error);

            res.sendStatus(500);

        }

    }
);

// ============================================
// PRODUCT ROUTES
// ============================================


// GET ALL PRODUCTS
app.get(
    "/api/products",
    async function(req,res){

        try{

            const products =
            await prisma.product.findMany({

                orderBy:{
                    createdAt:
                    "desc"
                }

            });


            res.json({

                success:true,

                count:
                products.length,

                products

            });


        }catch(error){

            console.error(error);


            res.status(500).json({

                success:false,

                message:
                "Unable to load products."

            });

        }

    }
);



// GET SINGLE PRODUCT

app.get(
    "/api/products/:id",
    async function(req,res){

        try{

            const product =
            await prisma.product.findUnique({

                where:{
                    id:
                    req.params.id
                }

            });


            if(!product){

                return res.status(404).json({

                    success:false,

                    message:
                    "Product not found."

                });

            }


            res.json({

                success:true,

                product

            });


        }catch(error){

            console.error(error);


            res.status(500).json({

                success:false,

                message:
                "Unable to find product."

            });

        }

    }
);




// CREATE PRODUCT

app.post(
    "/api/products",
    async function(req,res){

        try{

         const {
    name,
    description,
    price,
    stock,
    category,
    image,
    merchantId
} = req.body;



            if(
                !name ||
                !price
            ){

                return res.status(400).json({

                    success:false,

                    message:
                    "Product name and price required."

                });

            }



            const product =
            await prisma.product.create({

                data:{

                    name,

                    description:
                    description || null,

                    price:
                    Number(price),

                    stock:
                    Number(stock || 0),

                    category:
                    category || "General",

                   image:
image || null,

merchantId:
merchantId
                }

            });



            res.status(201).json({

                success:true,

                product

            });



        }catch(error){

            console.error(error);


            res.status(500).json({

                success:false,

                message:
                "Product creation failed."

            });

        }

    }
);





// UPDATE PRODUCT

app.put(
    "/api/products/:id",
    async function(req,res){

        try{


            const product =
            await prisma.product.update({

                where:{

                    id:
                    req.params.id

                },


                data:req.body

            });



            res.json({

                success:true,

                product

            });


        }catch(error){

            console.error(error);


            res.status(500).json({

                success:false,

                message:
                "Product update failed."

            });

        }

    }
);





// DELETE PRODUCT

app.delete(
    "/api/products/:id",
    async function(req,res){

        try{


            await prisma.product.delete({

                where:{

                  id:req.params.id
                }

            });


            res.json({

                success:true,

                message:
                "Product deleted."

            });


        }catch(error){

            console.error(error);


            res.status(500).json({

                success:false,

                message:
                "Product deletion failed."

            });

        }

    }
);
// ============================================
// ORDER ROUTES
// ============================================



// GET ALL ORDERS

app.get(
    "/api/orders",
    async function(req,res){

        try{


            const orders =
            await prisma.order.findMany({

                include:{

                    items:true,

                    customer:true,

                    payment:true

                },


                orderBy:{

                    createdAt:
                    "desc"

                }

            });



            res.json({

                success:true,

                count:
                orders.length,

                orders

            });



        }catch(error){

            console.error(error);


            res.status(500).json({

                success:false,

                message:
                "Unable to load orders."

            });

        }

    }
);





// CREATE ORDER AFTER PAYMENT

app.post(
    "/api/orders",
    async function(req,res){

        try{


            const {

                customer,

                items,

                paymentReference

            } = req.body;



            if(
                !customer ||
                !items ||
                items.length === 0
            ){

                return res.status(400).json({

                    success:false,

                    message:
                    "Customer and items required."

                });

            }




            // Find customer

            let user =
            await prisma.user.findUnique({

                where:{

                    email:
                    customer.email

                }

            });



            if(!user){

            user = await prisma.user.create({
 data:{
    name:customer.name,
    email:customer.email,
    phone:customer.phone,
    password:"guest-account",
    role:"CUSTOMER"
 }
});
            }





            let total = 0;

            const orderItems = [];




            // Check stock

            for(
                const item of items
            ){

                const product =
                await prisma.product.findUnique({

                    where:{

                        id:
                        item.id

                    }

                });



                if(!product){

                    return res.status(404).json({

                        success:false,

                        message:
                        "Product not found."

                    });

                }



                if(
                    product.stock <
                    item.quantity
                ){

                    return res.status(400).json({

                        success:false,

                        message:
                        "Not enough stock."

                    });

                }



                total +=
                product.price *
                item.quantity;



                orderItems.push({

                    productId:
                    product.id,

                    productName:
                    product.name,

                    price:
                    product.price,

                    quantity:
                    item.quantity

                });

            }





            // CREATE ORDER + UPDATE STOCK

            const order =
            await prisma.$transaction(

                async function(tx){



                    const newOrder =
                    await tx.order.create({

                        data:{


                            customerId:
                            user.id,


                            total,
                            paymentMethod:"PAYSTACK",

                            paymentReference,


                            paymentStatus:
                            "PAID",


                            status:
                            "CONFIRMED",



                            items:{

                                create:
                                orderItems

                            }


                        },



                        include:{

                            items:true

                        }


                    });





                    for(
                        const item of items
                    ){

                        await tx.product.update({

                            where:{

                                id:
                                item.id

                            },

                            data:{

                                stock:{

                                    decrement:
                                    item.quantity

                                }

                            }

                        });

                    }



                    return newOrder;


                }

            );





            res.status(201).json({

                success:true,

                order

            });



        }catch(error){


            console.error(error);


            res.status(500).json({

                success:false,

                message:
                "Order creation failed."

            });


        }


    }
);

// ============================================
// FRONTEND FALLBACK
// ============================================

app.get(
    "*",
    function(req,res){

        res.sendFile(

            path.join(
                __dirname,
                "..",
                "index.html"
            )

        );

    }
);




// ============================================
// GLOBAL ERROR HANDLER
// ============================================

app.use(

    function(
        error,
        req,
        res,
        next
    ){

        console.error(
            "SERVER ERROR:",
            error
        );


        res.status(500).json({

            success:false,

            message:
            "Internal server error."

        });


    }

);




// ============================================
// START SERVER
// ============================================

app.listen(

    PORT,

    function(){

        console.log(
            "🚀 Product Finder API running on port "
            + PORT
        );

    }

);
