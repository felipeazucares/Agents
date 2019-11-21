const express = require('express');
const router = express.Router();


//controllers for each set of us cases
const ctrlAgents = require('../controllers/agents');
const ctrlLists = require('../controllers/lists');
//const ctrlUser = require('../controllers/users');
//const ctrlSubs = require('../controllers/subs');

// agent routes
router
    .route('/resetall')
    .get(ctrlAgents.resetAll);
router
    .route('/agentsearch/:qry')
    .get(ctrlAgents.agentSearch)
router
    .route('/agentsearchsave/:qry/:name/:userID')
    .get(ctrlAgents.agentSearchSaveList)
router
    .route('/listFilter/:userID/:filter')
    .get(ctrlLists.agentListFilter)
router
    .route('/listDelete/:userID/:listId')
    .get(ctrlLists.agentListDelete)

module.exports = router;