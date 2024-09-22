import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SK);
const YOUR_DOMAIN = 'http://localhost:5173';

const paymentController = {
  createCheckOutSession: async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: parseInt(req.body.amount) * 100,
              product_data: {
                name: "Second Opinion Payment",
              },
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
      });

      res.send({ clientSecret: session.client_secret });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).send({ error: "Failed to create checkout session" });
    }
  },

  sessionStatus: async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
      res.send({
        status: session.payment_status,
        customer_email: session.customer_details.email,
        amount: session.amount_total,
      });
    } catch (error) {
      console.error("Error retrieving session status:", error);
      res.status(500).send({ error: "Failed to retrieve session status" });
    }
  },
};

export default paymentController;
