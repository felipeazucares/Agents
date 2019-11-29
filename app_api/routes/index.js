const express = require('express');
const router = express.Router();


//controllers for each set of us cases
const ctrlAgents = require('../controllers/agents');
const ctrlLists = require('../controllers/lists');
const ctrlUsers = require('../controllers/users');
//const ctrlSubs = require('../controllers/subs');

// agent routes
router
    .route('/resetall')
    .get(ctrlAgents.resetAll);
router
    .route('/agentsearch')
    .post(ctrlAgents.agentSearch)
router
    .route('/agentsearchsave')
    .post(ctrlAgents.agentSearchSaveList)
router
    .route('/listFilter/:userId/:filter')
    .get(ctrlLists.agentListFilter)
router
    .route('/listDelete/:userId/:listId')
    .get(ctrlLists.agentListDelete)
router
    .route('/listDeleteAll/:userId')
    .get(ctrlLists.agentListDeleteAll)
router
    .route('/listAddItem/:userId/:listId/:agentId')
    .get(ctrlLists.agentListAddItem)
router
    .route('/listDeleteItem/:userId/:listId/:agentId')
    .get(ctrlLists.agentListDeleteItem)
router
    .route('/addPiece/:userId')
    .post(ctrlUsers.addPiece)
router
    .route('/deletePiece/:userId/:pieceId')
    .get(ctrlUsers.deletePiece)
router
    .route('/addSubmission/:userId/:pieceId/:agentId')
    .post(ctrlUsers.addSubmission)
router
    .route('/deleteSubmission/:userId/:pieceId/:submissionId')
    .get(ctrlUsers.deleteSubmission)
module.exports = router;