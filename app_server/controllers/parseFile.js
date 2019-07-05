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
        'Directors',
        'Additional Information',
        'Additional Contacts',
        'Authors',
        'Agents']
    let index = 0;
    let currentField = 'unknown';
    let found = false;
    let debug = true;

    for (i = 0; i <= inputDataRecs.length - 1; i++) {
        //remove any double quotes, colons or UTF specials from input records
        inputDataRecs[i] = inputDataRecs[i].replace(/[�":]+/g, '');
        found = false;
        /* check current record against list of categories */
        for (j = 0; j <= categories.length - 1; j++) {
            if (debug == true) { console.log(`Looking for ${categories[j]} `) }
            if (inputDataRecs[i].toLowerCase().trim() == categories[j].toLowerCase()) {
                // detected new field name so write accumulated data to parsed records with last key read from file 
                // first of all check to see if we've detected back to explore which is start of a new agency
                found = true;
                if (categories[j] != 'back to explore categories') {
                    //recordStart = false;
                    if (debug == true) { console.log(`Found ${categories[j]} in ${inputDataRecs[i]}`) }
                    if (debug == true) { console.log(`Writing ${accumulatedData} to ${currentField} in record: ${index}`) }
                    // replace any spaces in the category
                    parsedRecords[index][currentField] = accumulatedData;
                    //now reset name of field we are collecting data for
                    currentField = categories[j].toLowerCase().replace(" ", "_");
                    //once we've found a category don't need to search for any more
                    if (debug == true) { console.log(`resetting accumulatedData. Index = ${index}`) }
                    accumulatedData = '';
                    break;
                }
                else {
                    if (debug == true) { console.log(`Found new agency ${inputDataRecs[i]}: data accumulated: ${accumulatedData}`) }
                    //index += 1;
                    // if we have a new agency then anything in the buffer belongs to the previous agency
                    // we need to go through the buffer and split it on CRs and write out everything apart from the last item
                    if (accumulatedData.length > 0) {
                        let accumulatedDataSplit = accumulatedData.split('\r\n');
                        console.log(`accumulatedDataSplit:${JSON.stringify(accumulatedDataSplit)}`);
                        if (accumulatedDataSplit.length > 0) {
                            //split always gives us an empty member at the end so pop that off first 
                            accumulatedDataSplit.pop()
                            //get next to last and store as name
                            let newName = accumulatedDataSplit.pop();
                            // rejoin remaining members
                            let accumulatedData = accumulatedDataSplit.join('\r\n');
                            //now write these to previopus agency
                            parsedRecords[index][currentField] = accumulatedData;
                            //now create a new one and write the name into it
                            index = parsedRecords.push({ name: newName }) - 1
                        }

                    }
                    //parsedRecords[index]['name'] = accumulatedData;
                    //index=parsedRecords.push({name: accumulatedData})-1
                    //after the name we usually get the agencies' deets
                    currentField = "details";
                    if (debug == true) { console.log(`resetting accumulatedData. Index = ${index}`) }
                    accumulatedData = '';
                    break;

                }

            }
        }
        //only accumulate for non empty records or ones that don't contain categories
        if (inputDataRecs[i].length != 0 && found != true) {
            if (debug == true) { console.log(`accumulating: ${currentField} : ${inputDataRecs[i]} `) }
            if (debug == true) { console.log(`accumulatedData: ${accumulatedData}`) }
            accumulatedData += inputDataRecs[i] + '\r\n';
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
