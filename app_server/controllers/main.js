
const reader = require('../controllers/readFile');
const parser = require('../controllers/parseFile');
const fs = require('fs')



const index = (req, res) => {
    reader.getFileAsync('./app_server/models/Agents_2018.txt').then(dataOutput => {
        console.log('Got data. Serving page');
        // dataOutput = JSON.stringify(dataOutput.split('\t\r\n'));
        dataOutput = dataOutput.split('\t\r\n');       
        //console.log(JSON.stringify(dataOutput));
        parser.parseFile(dataOutput.slice(0,16));
        res.render('index',{title:'Agents', agentData: dataOutput});
    }).catch(err => {
        console.error(err);
    });

  };


module.exports={
    index
}

