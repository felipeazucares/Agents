/* 
    Parses the array provided and extracts the field categories
    and constructs a javascript object
*/

const parseFile = (inputDataRecs) => {
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

    let index = -1;
    let currentField = 'unknown';
    let found = false;
    let debug = true;
    
    for (i = 0; i <= inputDataRecs.length - 1; i++) {
        found = false;
        /* check current record against list of categories */
        for (j = 0; j <= categories.length - 1; j++) {
            if (debug == true) { console.log(`Looking for ${categories[j]} `) }
            if (inputDataRecs[i].toLowerCase().trim() == categories[j].toLowerCase()) {
                // detected new field name so write accumuated data to parsed records with last key read from file 
                // first of all check to see if we've detected back to explore which is start of a new agency
                found = true;
                if (categories[j] != 'back to explore categories') {
                    //recordStart = false;
                    if (debug == true) { console.log(`Found ${categories[j]} in ${inputDataRecs[i]}`) }
                    if (debug == true) { console.log(`Writing ${accumulatedData} to ${currentField} in record: ${index}`) }
                    parsedRecords[index][currentField] = accumulatedData;
                    //now reset name of field we are collecting data for
                    currentField = categories[j].toLowerCase();
                    //once we've found a category don't need to search for any more
                    if (debug == true) { console.log(`resetting accumulatedData`) }
                    accumulatedData = '';
                    break;
                }
                else {
                    if (debug == true) { console.log(`Found new agency ${inputDataRecs[i]}: data accumulated: ${accumulatedData}`) }
                    index += 1;
                    
                    //parsedRecords[index]['name'] = accumulatedData;
                    index=parsedRecords.push({name: accumulatedData})-1
                    //after the name we usually get the agencies' deets
                    currentField = "details";
                    if (debug == true) { console.log(`resetting accumulatedData. Index = ${index}`) }
                    accumulatedData = '';

                }

            }
        }
        //only accumulate for non empty records or ones that don't contain categories
        if (inputDataRecs[i].length != 0 && found != true) {
            if (debug == true) { console.log(`accumulating: ${currentField} : ${inputDataRecs[i]} `) }
            if (debug == true) { console.log(`accumulatedData: ${accumulatedData}`) }
            accumulatedData += inputDataRecs[i]
        }
    }

    //once reading the input records  is complete need to write out last set of accumulated data.
    if (debug == true) { console.log(`Reached end of input records.`) }
    if (debug == true) { console.log(`Writing ${accumulatedData} to ${currentField} in record: ${index}`) }
    parsedRecords[index][currentField] = accumulatedData;

    if (debug == true) { console.log(`result: ${JSON.stringify(parsedRecords)}`) }
    return parsedRecords;
}

module.exports = {
    parseFile
}
