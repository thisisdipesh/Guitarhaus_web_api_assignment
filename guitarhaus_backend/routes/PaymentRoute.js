const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/verify-khalti', async (req, res) => {
    const { token, amount } = req.body;

    try {
        const response = await axios.post(
            'https://khalti.com/api/v2/payment/verify/',
            {
                token,
                amount,
            },
            {
                headers: {
                    Authorization: 'Key YOUR_SECRET_KEY_HERE', // Replace with your actual Khalti secret key or use env variable
                },
            }
        );

        res.json({
            success: true,
            data: response.data,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.response?.data || error.message,
        });
    }
});

module.exports = router; 