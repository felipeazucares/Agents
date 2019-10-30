var express = require('express');
var router = express.Router();
const ctrlMain = require('../../app_api/controllers/agents');


/* GET home page. */
router.get('/', ctrlMain.index);

module.exports = router;
