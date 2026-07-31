require("dotenv").config();

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();

const PORT = process.env.PORT || 3000;
const PAYSTACK_SECRET_KEY =
    process.env.PAYSTACK_SECRET_KEY;

const FRONTEND_URL =
    process.env.FRONTEND_URL ||
    "https://mahama59.github.io";

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

app.use(express.json());


// ============================================
// HEALTH CHECK
// ============================================

app.get("/", function(req, res) {

    res.json({
        success: true,
        service: "Product Finder Payment API"
    });

});


// ============================================
// VERIFY PAYSTACK TRANSACTION
// ============================================

app.get(
    "/api/paystack/verify/:reference",
    async function(req, res) {

        const reference =
            req.params.reference;

        if (!reference) {

            return res.status(400).json({
                success: false,
                message: "Transaction reference is required."
            });

        }

        if (!PAYSTACK_SECRET_KEY) {

            return res.status(500).json({
                success: false,
                message: "Paystack server key is not configured."
            });

        }

        try {

            const response =
                await fetch(
                    "https://api.paystack.co/transaction/verify/" +
                    encodeURIComponent(reference),
                    {
                        method: "GET",
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

                return res.status(
                    response.status
                ).json({
                    success: false,
                    message:
                        data.message ||
                        "Paystack verification failed."
                });
            }

            return res.json({
                success: Boolean(
                    data.status
                ),
                message:
                    data.message || "",
                data:
                    data.data || null
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
// PAYSTACK WEBHOOK
// ============================================

app.post(
    "/api/paystack/webhook",
    express.raw({
        type: "application/json"
    }),
    function(req, res) {

        if (!PAYSTACK_SECRET_KEY) {

            return res.status(500).send(
                "Webhook secret not configured."
            );
        }

        const signature =
            req.headers[
                "x-paystack-signature"
            ];

        if (!signature) {
            return res.status(401).send(
                "Missing Paystack signature."
            );
        }

        const expectedSignature =
            crypto
                .createHmac(
                    "sha512",
                    PAYSTACK_SECRET_KEY
                )
                .update(req.body)
                .digest("hex");

        const received =
            Buffer.from(signature, "utf8");

        const expected =
            Buffer.from(
                expectedSignature,
