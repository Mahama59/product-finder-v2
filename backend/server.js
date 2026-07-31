require("dotenv").config();

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const prisma =
    require("./prismaClient");
const app = express();

const PORT =
    process.env.PORT || 3000;

const PAYSTACK_SECRET_KEY =
    process.env.PAYSTACK_SECRET_KEY;

const FRONTEND_URL =
    process.env.FRONTEND_URL ||
    "https://mahama59.github.io";

// Temporary storage.
// We will replace this with a real database later.
const orders = [];
const pendingPayments = new Map();

if (!PAYSTACK_SECRET_KEY) {

    console.warn(
        "WARNING: PAYSTACK_SECRET_KEY is not configured."
    );
}

app.use(
    cors({
        origin: FRONTEND_URL
    })
);


// ============================================
// PAYSTACK WEBHOOK
// ============================================
//
// IMPORTANT:
// This route must come before express.json()
// because Paystack signature verification
// requires the original raw request body.
//

app.post(
    "/api/paystack/webhook",
    express.raw({
        type: "application/json"
    }),
    function (req, res) {

        if (!PAYSTACK_SECRET_KEY) {

            return res
                .status(500)
                .send(
                    "Webhook secret not configured."
                );
        }

        const signature =
            req.headers[
                "x-paystack-signature"
            ];

        if (!signature) {

            return res
                .status(401)
                .send(
                    "Missing Paystack signature."
                );
        }

        const rawBody =
            Buffer.isBuffer(req.body)
                ? req.body
                : Buffer.from(
                    req.body || ""
                );

        const expectedSignature =
            crypto
                .createHmac(
                    "sha512",
                    PAYSTACK_SECRET_KEY
                )
                .update(rawBody)
                .digest("hex");

        const received =
            Buffer.from(
                String(signature),
                "utf8"
            );

        const expected =
            Buffer.from(
                expectedSignature,
                "utf8"
            );

        if (
            received.length !==
                expected.length ||
            !crypto.timingSafeEqual(
                received,
                expected
            )
        ) {

            console.warn(
                "Rejected Paystack webhook: invalid signature."
            );

            return res
                .status(401)
                .send(
                    "Invalid Paystack signature."
                );
        }

        let event;

        try {

            event =
                JSON.parse(
                    rawBody.toString("utf8")
                );

        } catch (error) {

            console.error(
                "Invalid Paystack webhook JSON:",
                error
            );

            return res
                .status(400)
                .send(
                    "Invalid webhook payload."
                );
        }

        console.log(
            "Paystack webhook received:",
            event.event
        );


// ========================================
// SUCCESSFUL PAYSTACK PAYMENT
// ========================================

if (
    event.event ===
    "charge.success"
) {

    const transaction =
        event.data || {};

    const reference =
        transaction.reference;

    console.log(
        "PAYSTACK PAYMENT SUCCESS",
        {
            reference:
                transaction.reference,

            amount:
                transaction.amount,

            currency:
                transaction.currency,

            channel:
                transaction.channel,

            paidAt:
                transaction.paid_at
        }
    );

    try {

        const paymentIntent =
            await prisma.paymentIntent.findUnique({
                where: {
                    reference:
                        reference
                }
            });

        if (!paymentIntent) {

            console.warn(
                "PaymentIntent not found:",
                reference
            );

            return res.status(200).json({
                success: true,
                received: true
            });
        }

        const expectedAmount =
            Math.round(
                Number(
                    paymentIntent.amount
                ) * 100
            );

        const receivedAmount =
            Number(
                transaction.amount
            );

        const amountMatches =
            expectedAmount ===
            receivedAmount;

        const currencyMatches =
            transaction.currency ===
            paymentIntent.currency;

        if (
            !amountMatches ||
            !currencyMatches
        ) {

            console.error(
                "PAYSTACK PAYMENT MISMATCH",
                {
                    reference:
                        reference,

                    expectedAmount:
                        expectedAmount,

                    receivedAmount:
                        receivedAmount,

                    expectedCurrency:
                        paymentIntent.currency,

                    receivedCurrency:
                        transaction.currency
                }
            );

            return res.status(200).json({
                success: true,
                received: true
            });
        }

        await prisma.paymentIntent.update({
            where: {
                reference:
                    reference
            },

            data: {

                status:
                    "PAID",

                channel:
                    transaction.channel ||
                    null,

                paidAt:
                    transaction.paid_at
                        ? new Date(
                            transaction.paid_at
                        )
                        : new Date()

            }
        });

        console.log(
            "PaymentIntent marked PAID:",
            reference
        );

    } catch (error) {

        console.error(
            "PaymentIntent webhook update failed:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Payment webhook processing failed."
        });
    }
}


// ============================================
// JSON BODY PARSING
// ============================================

app.use(
    express.json()
);



// ============================================
// HEALTH CHECK
// ============================================

app.get(
    "/",
    function (req, res) {

        return res.json({
            success: true,
            service:
                "Product Finder Payment API",
            status:
                "online"
        });

    }
);


// ============================================
// DATABASE HEALTH CHECK
// ============================================

app.get(
    "/api/health/database",
    async function (req, res) {

        try {

            await prisma.$queryRaw`
                SELECT 1
            `;

            return res.json({

                success: true,

                database:
                    "connected"

            });

        } catch (error) {

            console.error(
                "Database health check failed:",
                error
            );

            return res.status(500).json({

                success: false,

                database:
                    "disconnected"

            });

        }
    }
);


// ============================================
// VERIFY PAYSTACK TRANSACTION
// ============================================

app.get(
    "/api/paystack/verify/:reference",
    async function (req, res) {

// ============================================
// INITIALIZE PAYSTACK TRANSACTION
// ============================================

app.post(
    "/api/paystack/initialize",
    async function (req, res) {

        const email =
            String(
                req.body.email || ""
            )
            .trim()
            .toLowerCase();

        const amount =
            Number(
                req.body.amount || 0
            );

        if (!email) {

            return res.status(400).json({

                success: false,

                message:
                    "Customer email is required."

            });
        }

        if (amount <= 0) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment amount must be greater than zero."

            });
        }

        if (!PAYSTACK_SECRET_KEY) {

            return res.status(500).json({

                success: false,

                message:
                    "Paystack server key is not configured."

            });
        }

        try {

            const response =
                await fetch(
                    "https://api.paystack.co/transaction/initialize",
                    {

                        method:
                            "POST",

                        headers: {

                            Authorization:
                                "Bearer " +
                                PAYSTACK_SECRET_KEY,

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                email:
                                    email,

                                amount:
                                    Math.round(
                                        amount * 100
                                    ),

                                currency:
                                    "GHS",

                                metadata: {

                                    productFinder:
                                        true,

                                    customerEmail:
                                        email

                                }

                            })

                    }
                );

            const data =
                await response.json();

            if (
                !response.ok ||
                !data.data
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        data.message ||
                        "Paystack transaction initialization failed."

                });
            }

            const reference =
                data.data.reference;

await prisma.paymentIntent.create({
    data: {
        reference: reference,
        email: email,
        amount: amount,
        currency: "GHS",
        method: "PAYSTACK",
        status: "PENDING",
        accessCode:
            data.data.access_code
    }
});
            

            return res.json({

                success: true,

                message:
                    data.message ||
                    "Authorization URL created.",

                accessCode:
                    data.data.access_code,

                reference:
                    reference

            });

        } catch (error) {

            console.error(
                "Paystack initialization error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to initialize Paystack transaction."

            });
        }
    }
);


// ============================================
// VERIFY PAYSTACK TRANSACTION
// ============================================

app.get(
    "/api/paystack/verify/:reference",
    async function (req, res) {

        const reference =
            req.params.reference;

        if (!reference) {

            return res.status(400).json({

                success: false,

                message:
                    "Transaction reference is required."

            });
        }

        if (!PAYSTACK_SECRET_KEY) {

            return res.status(500).json({

                success: false,

                message:
                    "Paystack server key is not configured."

            });
        }

        try {

            const response =
                await fetch(

                    "https://api.paystack.co/transaction/verify/" +
                    encodeURIComponent(
                        reference
                    ),

                    {

                        method:
                            "GET",

                        headers: {

                            Authorization:
                                "Bearer " +
                                PAYSTACK_SECRET_KEY,

                            "Content-Type":
                                "application/json"

                        }

                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                return res
                    .status(
                        response.status
                    )
                    .json({

                        success: false,

                        message:
                            data.message ||
                            "Paystack verification failed."

                    });
            }

            const transaction =
                data.data || null;

            return res.json({

                success:
                    Boolean(
                        data.status &&
                        transaction
                    ),

                message:
                    data.message || "",

                data:
                    transaction

            });

        } catch (error) {

            console.error(
                "Paystack verification error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to verify transaction."

            });
        }
    }
);


// ============================================
// PAYMENT STATUS
// ============================================

app.get(
    "/api/payments/:reference",
    function (req, res) {

        const reference =
            req.params.reference;

        const payment =
            pendingPayments.get(
                reference
            );

        if (!payment) {

            return res
                .status(404)
                .json({

                    success: false,

                    message:
                        "Payment reference not found."

                });
        }

        return res.json({

            success: true,

            payment:
                payment

        });
    }
);


// ============================================
// CREATE VERIFIED PAYSTACK ORDER
// ============================================

app.post(
    "/api/orders/paystack",
    async function (req, res) {

        const body =
            req.body || {};

        const reference =
            String(
                body.paymentReference ||
                ""
            ).trim();

        const expectedAmount =
            Number(
                body.total || 0
            );

        const customer =
            body.customer || {};

        const items =
            Array.isArray(
                body.items
            )
                ? body.items
                : [];

        if (!reference) {

            return res.status(400).json({

                success: false,

                message:
                    "Paystack payment reference is required."

            });
        }

        if (
            expectedAmount <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Order total must be greater than zero."

            });
        }

        if (
            !customer.email
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Customer email is required."

            });
        }

        if (
            items.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Order must contain at least one item."

            });
        }

        const alreadyProcessed =
            orders.find(
                function (order) {

                    return (
                        order.paymentReference ===
                        reference
                    );

                }
            );

        if (
            alreadyProcessed
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "This payment reference has already been used.",

                order:
                    alreadyProcessed

            });
        }

        if (!PAYSTACK_SECRET_KEY) {

            return res.status(500).json({

                success: false,

                message:
                    "Paystack server key is not configured."

            });
        }

        try {

            const response =
                await fetch(

                    "https://api.paystack.co/transaction/verify/" +
                    encodeURIComponent(
                        reference
                    ),

                    {

                        method:
                            "GET",

                        headers: {

                            Authorization:
                                "Bearer " +
                                PAYSTACK_SECRET_KEY,

                            "Content-Type":
                                "application/json"

                        }

                    }
                );

            const data =
                await response.json();

            if (
                !response.ok ||
                !data.data
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        data.message ||
                        "Paystack transaction could not be verified."

                });
            }

            const transaction =
                data.data;

            const expectedAmountInSubunit =
                Math.round(
                    expectedAmount *
                    100
                );

            const verified =
                transaction.status ===
                    "success" &&

                Number(
                    transaction.amount
                ) ===
                    expectedAmountInSubunit &&

                transaction.currency ===
                    "GHS";

            if (!verified) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Payment verification failed. Amount, currency, or status did not match the order."

                });
            }

            const order = {

                id:
                    Date.now(),

                customer:
                    customer,

                items:
                    items,

                total:
                    expectedAmount,

                paymentMethod:
                    "Paystack",

                paymentReference:
                    reference,

                paymentStatus:
                    "Paid",

                status:
                    "New",

                shippingStatus:
                    "Processing",

                trackingNumber:
                    "Not assigned",

                date:
                    new Date().toISOString()

            };

            orders.push(
                order
            );

            return res
                .status(201)
                .json({

                    success: true,

                    message:
                        "Verified payment order created successfully.",

                    order:
                        order

                });

        } catch (error) {

            console.error(
                "Verified order creation error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to create verified order."

            });
        }
    }
);


// ============================================
// TEMPORARY ORDER LIST
// ============================================

app.get(
    "/api/orders",
    function (req, res) {

        return res.json({

            success:
                true,

            count:
                orders.length,

            orders:
                orders

        });
    }
);


// ============================================
// START SERVER
// ============================================

app.listen(
    PORT,
    function () {

        console.log(
            "Product Finder Payment API running on port " +
            PORT
        );

    }
);
