const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('In the comics index route.');
});

module.exports = router;
