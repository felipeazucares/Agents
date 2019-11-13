const express = require('express');
const router = express.Router();


//controllers for each set of us cases
const ctrlAgents = require('../controllers/agents');
//const ctrlUser = require('../controllers/users');
//const ctrlSubs = require('../controllers/subs');

// agent routes
router
    .route('/reset')
    .get(ctrlAgents.reset);
router
    .route('/search')
    .get(ctrlAgents.search)

module.exports = router;