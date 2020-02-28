/**
 * Parse a location history 
 * @param {Array} history: the parsed content of a semantinc activity location history file  
 * @param {Array} parsedActivities: array to which will be appended the parsed activities.
 */
function parseActivities(history, parsedActivities) {
    if(!history.timelineObjects) { return; }

    history.timelineObjects.forEach(timelineObject => {
        const activitySegment = timelineObject.activitySegment;
        if(activitySegment && activitySegment.activityType === 'FLYING') {
            const activity = {
                activityType : activitySegment.activityType,
                distance: activitySegment.distance,
                startLocation: activitySegment.startLocation,
                endLocation: activitySegment.endLocation,
                duration: activitySegment.duration,
            };
            parsedActivities.push(activity);
        }
        
    })
}

// This is the only function that depends on JSZip
async function handleZipFile(f) {
    console.log(`unzipping ${f.name}`);

    const activities = [];

    let zip = await JSZip.loadAsync(f);
    zip.forEach(async (relativePath, zipEntry) => {
        // we only want to process files of the type: "Takeout/Location History/Semantic Location History/2019/2019_AUGUST.json"
        // we do not want "Takeout/Location History/Location History.json" or any other .json file in potenrial other folders
        if(zipEntry.name.match(/^Takeout\/Location History\/Semantic Location History\/.*\.json$/)) {
            console.log(`Parsing ${zipEntry.name}`);
            const fileContent = await zip.file(zipEntry.name).async("string");
            parseActivities(JSON.parse(fileContent), activities);
        }
    });

    // TODO: ensure activities is populated before calling
    printResults(activities);
}

function printResults(activities) {
    console.log(activities);
}

document.getElementById("zip-select").addEventListener('change', (event) => {
    if(event.target.files) {
        handleZipFile(event.target.files[0])
    }
});