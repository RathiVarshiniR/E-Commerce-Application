const express = require('express');
const router = express.Router();

// Cart is managed client-side (localStorage). This route is a placeholder
// for future server-side cart sync if needed.
router.get('/', (req, res) => res.json({ message: 'Cart is managed client-side' }));

module.exports = router;