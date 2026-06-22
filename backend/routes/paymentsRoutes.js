const express = require('express');
const crypto = require('crypto');
const User = require('../model/userModel');

const router = express.Router();

// 💳 PAYSTACK WEBHOOK LISTENER
router.post('/webhook', async (req, res) => {
  try {
    // 1. Verify the request signature to prevent fraud
    // req.body is captured as a raw text string directly from server.js
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(req.body) // ✅ Reading the raw incoming text stream directly
      .digest('hex');
    
    // Compare calculated hash with the signature header Paystack sent
    if (hash !== req.headers['x-paystack-signature']) {
      console.error('❌ Security Alert: Invalid webhook signature detected.');
      return res.status(401).json({ error: 'Unauthorized signature' });
    }

    // 2. Signature is valid! Parse the text payload into an object manually
    const eventData = JSON.parse(req.body);
    const { event, data } = eventData;
    console.log(`📥 Paystack Webhook Received Event: ${event}`);

    // 3. Process successful payments (Card, Bank Transfer, USSD, etc.)
    if (event === 'charge.success') {
      const customerEmail = data.customer.email;
      const amountPaid = data.amount / 100; // Convert kobo to Naira

      console.log(`💰 Processing successful payment of ₦${amountPaid} for: ${customerEmail}`);

      // 4. Update the client's plan status to 'premium' in MongoDB
      const updatedUser = await User.findOneAndUpdate(
        { email: customerEmail },
        { $set: { plan: 'premium' } },
        { new: true }
      );

      if (updatedUser) {
        console.log(`🚀 Success: ${customerEmail} has been officially upgraded to Premium!`);
      } else {
        console.warn(`⚠️ Payment received, but no user found in database with email: ${customerEmail}`);
      }
    }

    // 5. Respond to Paystack immediately with a 200 OK
    res.status(200).send('Webhook processed');

  } catch (error) {
    console.error('❌ Webhook Processing Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;