// back-end/API/routes/check-auth.js
const express = require('express');
const router = express.Router();
const { protect } = require('../../Authentication_Middleware');

router.get('/', protect, (req, res) => {
    res.json({ 
        authenticated: true,
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
    });
});

module.exports = router;
