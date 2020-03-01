const ACTIVITY_TYPE_TRANSPORTATION = 'ACTIVITY_TYPE_TRANSPORTATION';
const TRANSPORTATION_MODE_PLANE = 'TRANSPORTATION_MODE_PLANE';

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
                id: activitySegment.duration.startTimestampMs,
                datetime: new Date(parseInt(activitySegment.duration.startTimestampMs, 10)),
                durationHours: (activitySegment.duration.endTimestampMs - activitySegment.duration.startTimestampMs) / (1000 * 60 * 60),
                distanceKilometers: activitySegment.distance / 1000,
                activityType: ACTIVITY_TYPE_TRANSPORTATION,
                transportationMode: TRANSPORTATION_MODE_PLANE,
            };
            parsedActivities.push(activity);
        }
        
    })
}

// This is the only function that depends on JSZip
async function handleZipFile(f) {
    console.log(`unzipping ${f.name}`);

    const activities = [];

    const zip = await JSZip.loadAsync(f);

    // we only want to process files of the type: "Takeout/Location History/Semantic Location History/2019/2019_AUGUST.json"
    // we do not want "Takeout/Location History/Location History.json" or any other .json file in potenrial other folders
    const files = zip.file(/^Takeout\/Location History\/Semantic Location History\/.*\.json$/);
    const fileContents = await Promise.all( files.map(f => f.async("string")) );

    fileContents.forEach(fileContent => parseActivities(JSON.parse(fileContent), activities));

    printResults(activities);
}

function printResults(activities) {
    console.log(`Found ${activities.length} activities`);
    console.log(activities);
}

document.getElementById("zip-select").addEventListener('change', (event) => {
    if(event.target.files) {
        handleZipFile(event.target.files[0]);
    }
});