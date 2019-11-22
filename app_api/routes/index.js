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
    .route('/agentsearch')
    .post(ctrlAgents.agentSearch)
router
    .route('/agentsearchsave/:qry/:name/:userID')
    .get(ctrlAgents.agentSearchSaveList)
router
    .route('/listFilter/:userId/:filter')
    .get(ctrlLists.agentListFilter)
router
    .route('/listDelete/:userId/:listId')
    .get(ctrlLists.agentListDelete)
router
    .route('/listAddItem/:userId/:listId/:agentId')
    .get(ctrlLists.agentListAddItem)
router
    .route('/listDeleteItem/:userId/:listId/:agentId')
    .get(ctrlLists.agentListDeleteItem)

module.exports = router;