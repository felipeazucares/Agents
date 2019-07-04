// read file using a promisyfied version of readFileAsync 
const fs = require('fs');

// make promise version of fs.readFile()
fs.readFileAsync = function(filename) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filename, 'utf8', function(err, data){
            if (err) {
                console.log(`Error reading file ${filename}`)
                reject(err); 
            }
            else {
                resolve(data);
            }
        });
    });
};

// utility function
const getFileAsync = function (filename) {
    return fs.readFileAsync(filename);
}

module.exports={
    getFileAsync
}