const {
    PrismaClient
} = require("@prisma/client");

const prisma =
    new PrismaClient();

async function main() {

    console.log(
        "Starting Product Finder database seed..."
    );

    // ==========================================
    // CREATE / FIND DEMO MERCHANT
    // ==========================================

    const merchant =
        await prisma.user.upsert({

            where: {
                email:
                    "merchant@productfinder.test"
            },

            update: {},

            create: {

                name:
                    "Product Finder Demo Store",

                email:
                    "merchant@productfinder.test",

                phone:
                    "0000000000",

                role:
                    "MERCHANT"
            }
        });

    console.log(
        "Merchant ready:",
        merchant.id
    );


    // ==========================================
    // CREATE / FIND PRODUCTS
    // ==========================================

    const products = [

        {
            name:
                "Product Finder Smartphone",

            description:
                "A demo smartphone for testing the marketplace.",

            price:
                2500.00,

            stock:
                20,

            category:
                "Smartphones",

            image:
                ""
        },

        {
            name:
                "Product Finder Laptop",

            description:
                "A demo laptop for testing marketplace orders.",

            price:
                6500.00,

            stock:
                10,

            category:
                "Laptops",

            image:
                ""
        },

        {
            name:
                "Product Finder Headphones",

            description:
                "A demo pair of wireless headphones.",

            price:
                850.00,

            stock:
                30,

            category:
                "Audio",

            image:
                ""
        }

    ];


    for (
        const product of products
    ) {

        const existing =
            await prisma.product.findFirst({

                where: {

                    name:
                        product.name,

                    merchantId:
                        merchant.id

                }
            });


        if (existing) {

            console.log(
                "Product already exists:",
                existing.name
            );

            continue;
        }


        const created =
            await prisma.product.create({

                data: {

                    name:
                        product.name,

                    description:
                        product.description,

                    price:
                        product.price,

                    stock:
                        product.stock,

                    category:
                        product.category,

                    image:
                        product.image,

                    merchantId:
                        merchant.id

                }
            });


        console.log(
            "Created product:",
            created.name
        );
    }


    console.log(
        "Product Finder database seed completed."
    );
}


main()
    .catch(
        function (error) {

            console.error(
                "Database seed failed:",
                error
            );

            process.exit(1);
        }
    )
    .finally(
        async function () {

            await prisma.$disconnect();

        }
    );
