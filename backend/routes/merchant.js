const express = require("express");
const prisma = require("../prismaClient");

const router = express.Router();

const protect = require("../middleware/auth");
const allowRoles = require("../middleware/role");


// =================================
// GET MERCHANT PRODUCTS
// =================================

router.get(
"/products",
protect,
allowRoles("MERCHANT"),
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



// =================================
// CREATE PRODUCT
// =================================

router.post(
"/products",
protect,
allowRoles("MERCHANT"),
async(req,res)=>{

    try{


        const {
            name,
            description,
            price,
            stock,
            category,
            image
        } = req.body;



        const product =
        await prisma.product.create({

            data:{

                name,

                description,

                price:Number(price),

                stock:Number(stock || 0),

                category,

                image,

                merchantId:
                req.user.id

            }

        });



        res.json({

            success:true,

            product

        });



    }catch(error){

        console.error(error);


        res.status(500).json({

            success:false,

            message:"Product creation failed"

        });

    }

});



// =================================
// DELETE PRODUCT
// =================================

router.delete(
"/products/:id",
protect,
allowRoles("MERCHANT"),
async(req,res)=>{


    try{


        const product =
        await prisma.product.findUnique({

            where:{
                id:req.params.id
            }

        });



        if(!product){

            return res.status(404).json({

                success:false,

                message:"Product not found"

            });

        }



        if(product.merchantId !== req.user.id){

            return res.status(403).json({

                success:false,

                message:"Not your product"

            });

        }



        await prisma.product.delete({

            where:{
                id:req.params.id
            }

        });



        res.json({

            success:true,

            message:"Product deleted"

        });



    }catch(error){

        console.error(error);


        res.status(500).json({

            success:false,

            message:"Delete failed"

        });

    }


});



// =================================
// MERCHANT DASHBOARD
// =================================

router.get(
"/dashboard",
protect,
allowRoles("MERCHANT"),
async(req,res)=>{


try{


const products =
await prisma.product.findMany({

where:{
merchantId:req.user.id
}

});



const totalStock =
products.reduce(
(total,p)=>total+p.stock,
0
);



const categories =
new Set(
products.map(
p=>p.category
)
);



res.json({

success:true,

dashboard:{

totalProducts:
products.length,

totalStock,

totalCategories:
categories.size,

recentProducts:
products.slice(0,5)

}

});



}catch(error){

console.error(error);


res.status(500).json({

success:false,

message:"Dashboard error"

});


}


});



module.exports = router;
