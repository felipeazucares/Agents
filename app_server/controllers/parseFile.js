/* Parses the file provided and extracts the categories
   the files is a set of 1 field records.
*/

const parseFile = function(inputDataRecs) {
    let accumulatedData = '';
    let parsedRecords = [{}];
    const categories = ['Telephone',
                    'Email',
                    'Address',
                    'Website',
                    'Membership',
                    'back to explore categories',
                    'Directors']
    
    let recordStart = true;
    let index = 0;
    let currentField = 'unknown';
    let found = false;
    for (i=0;i<=inputDataRecs.length-1;i++){
        found = false;
        /* check current record against list of categories */
        for(j=0;j<=categories.length-1;j++){
            console.log(`Looking for ${categories[j]} `)
            if(inputDataRecs[i].toUpperCase().trim()==categories[j].toUpperCase()) {
                // detected new field name so write all collected data to old key
                recordStart = false;
                found = true;
                //write accumuated data to parsed records with last key read from file 
                console.log(`Found in ${inputDataRecs[i]}`)
                parsedRecords[index][currentField] = accumulatedData;
                //now reset name of field we are collecting data for
                currentField = categories[j];
                //reset accumulated data for the field we are now collecting for
                accumulatedData = '';
                //once we've found a category don't need to search for any more
                break;
            }
        }
        //only accumulate for non empty records or ones that don't contain categories
        if(inputDataRecs[i].length!=0 && found!= true){
            console.log(`accumulating: ${currentField} : ${inputDataRecs[i]} `)
            accumulatedData+=inputDataRecs[i]
        }

    }
    
    console.log(`result: ${JSON.stringify(parsedRecords)}`)
}

module.exports={
    parseFile
}
