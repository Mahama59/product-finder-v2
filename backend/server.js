require("dotenv").config();

const express = require("express"); const cors = require("cors"); const crypto = require("crypto");

const app = express();

const PORT = process.env.PORT || 3000; const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY; const FRONTEND_URL = process.env.FRONTEND_URL || "https://mahama59.github.io";

if (!PAYSTACK_SECRET_KEY) { console.warn( "WARNING: PAYSTACK_SECRET_KEY is not configured." ); }

app.use( cors({ origin: FRONTEND_URL }) );

// IMPORTANT: // Paystack webhook signature verification requires the original // raw request body. This route must be registered BEFORE // express.json() is applied to the whole application. app.post( "/api/paystack/webhook", express.raw({ type: "application/json" }), function (req, res) { if (!PAYSTACK_SECRET_KEY) { return res .status(500) .send("Webhook secret not configured."); }

const signature =
        req.headers["x-paystack-signature"];

    if (!signature) {
        return res
            .status(401)
            .send("Missing Paystack signature.");
    }

    const rawBody = Buffer.isBuffer(req.body)
        ? req.body
        : Buffer.from(req.body || "");

    const expectedSignature = crypto
        .createHmac("sha512", PAYSTACK_SECRET_KEY)
        .update(rawBody)
        .digest("hex");

    const received = Buffer.from(
        String(signature),
        "utf8"
    );

    const expected = Buffer.from(
        expectedSignature,
        "utf8"
    );

    if (
        received.length !== expected.length ||
        !crypto.timingSafeEqual(received, expected)
    ) {
        console.warn(
            "Rejected Paystack webhook: invalid signature."
        );

        return res
            .status(401)
            .send("Invalid Paystack signature.");
    }

    let event;

    try {
        event = JSON.parse(rawBody.toString("utf8"));
    } catch (error) {
        console.error(
            "Invalid Paystack webhook JSON:",
            error
        );

        return res
            .status(400)
            .send("Invalid webhook payload.");
    }

    console.log(
        "Paystack webhook received:",
        event.event
    );

    // This is the point where the database/order update will be added.
    // For now we log the verified event so the payment backend can be
    // tested safely before connecting Prisma/database persistence.
    if (event.event === "charge.success") {
        const transaction = event.data || {};

        console.log(
            "PAYMENT SUCCESS",
            {
                reference: transaction.reference,
                amount: transaction.amount,
                currency: transaction.currency,
                channel: transaction.channel,
                paidAt: transaction.paid_at
            }
        );
    }

    // Paystack expects a successful HTTP response after the webhook
    // has been authenticated and accepted.
    return res.status(200).json({
        success: true,
        received: true
    });
}

);

// JSON parsing for all other API routes. app.use(express.json());

// ============================================ // HEALTH CHECK // ============================================

app.get("/", function (req, res) { return res.json({ success: true, service: "Product Finder Payment API", status: "online" }); });

// ============================================ // VERIFY PAYSTACK TRANSACTION // ============================================

app.get( "/api/paystack/verify/:reference", async function (req, res) { const reference = req.params.reference;

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
        const response = await fetch(
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

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                message:
                    data.message ||
                    "Paystack verification failed."
            });
        }

        const transaction = data.data || null;

        return res.json({
            success: Boolean(
                data.status &&
                transaction
            ),
            message: data.message || "",
            data: transaction
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

// ============================================ // START SERVER // ============================================

app.listen(PORT, function () { console.log( Product Finder Payment API running on port ${PORT} ); });
