/* 
    Parses the array provided and extracts the field categories
    and constructs a javascript object
*/

const parseFile = function (inputDataRecs) {
    let accumulatedData = '';
    let parsedRecords = [{}];
    // these are fields that we are looking for in each input element
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
    let debug = true;

    // need to add in logic to extract name from first couple of records keying
    // on 'back to explore' and then generate a logical record for each 
    // records post 'back to explore  should be added into a 'details' category
    // once this is structured we can write it into a database file

    for (i = 0; i <= inputDataRecs.length - 1; i++) {
        found = false;
        /* check current record against list of categories */
        for (j = 0; j <= categories.length - 1; j++) {
            if (debug == true) { console.log(`Looking for ${categories[j]} `) }
            if (inputDataRecs[i].toUpperCase().trim() == categories[j].toUpperCase()) {
                // detected new field name so write accumuated data to parsed records with last key read from file 
                // first of all check to see if we've detected back to explore which is start of a new agency
                found = true;
                if (categories[j] != 'back to explore categories') {
                    recordStart = false;
                    if (debug == true) { console.log(`Found in ${inputDataRecs[i]}`) }
                    parsedRecords[index][currentField] = accumulatedData;
                    //now reset name of field we are collecting data for
                    currentField = categories[j];
                    //once we've found a category don't need to search for any more
                    break;
                }
                else {
                    if (debug == true) { console.log(`Found new agency ${inputDataRecs[i]}`) }
                    index += 1;
                    //currentField = "name";
                    parsedRecords.push({name: accumulatedData});
                    //after the name we usually get the agencies' deets
                    currentField = "details;"
                }
                //reset accumulated data for the field we are now collecting for
                accumulatedData = '';
            }
        }
        //only accumulate for non empty records or ones that don't contain categories
        if (inputDataRecs[i].length != 0 && found != true) {
            if (debug == true) { console.log(`accumulating: ${currentField} : ${inputDataRecs[i]} `) }
            accumulatedData += inputDataRecs[i]
        }
    }

    if (debug == true) { console.log(`result: ${JSON.stringify(parsedRecords)}`) }
}

module.exports = {
    parseFile
}
