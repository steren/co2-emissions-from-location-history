// https://observablehq.com/@steren/your-co2-emissions-from-location-history@579
import define1 from "./a2166040e5fb39a6@229.js";
import define2 from "./7764a40fe6b83ca1@427.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["example@2.png",new URL("./files/0c8083998b86a4a7fa1fd9ac848f164114fa5fc65095c4f7f0c3ea326da3a76acf2fedaec6ec19873df774e55d905dbf906671b015944cb81fa13110b55f515d",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md","FileAttachment"], async function(md,FileAttachment){return(
md`
# Your CO<sub>2</sub> emissions from Location History

This notebook computes an estimate of your past transportation-related CO<sub>2</sub> emissions using your [Google Location History](https://support.google.com/accounts/answer/3118687?hl=en) (an opt-in feature also called "[Timeline](https://support.google.com/maps/answer/6258979?co=GENIE.Platform%3DAndroid&hl=en)" in Google Maps).

After selecting your data, you get something like this:
${await FileAttachment("example@2.png").image()}

This notebook **does not store or upload your data**. All computation is done client-side using JavaScript in your web browser.

Greenhouse gases are responisble for climate change, read more in [*A pragmatic guide climate change*](https://www.tmrow.com/climatechange). Greenhouse gas emission is mearued in "CO<sub>2</sub> equivalent". Transporation emit greenhouse gas, being able to understand how much might help you reduce your impact on climate change. 

Only Flights and car rides will be taken into account, other means of transportation like trains will be skipped or can be miscategorized.
You might have offset some of these emissions, this is not be reflected in these charts, that only show *emissions*.

**See also:** To automatically track your CO<sub>2</sub> emissions and understand your monthly budget, I recommend using the [North mobile app](https://north-app.com/).


## How to use

*You can stop reading if you have not enabled Google Location History before*.

1. Request an archive of your Google Location History
    * Visit https://takeout.google.com
    * Under "*Create a new export*":
      * Click "*Deselect all*"
      * Scroll and check "*Location History*".
      * Scroll and click "*Next Step*"
    * Under "*Choose file type, frequency & destination*", keep the default values: Export once a ".zip" file.
    * Click "*Create Export*".
    
1. Download the archive
    * You will receive an email after some time (it usually takes minutes or up to a few hours)
    * Click the link from the email
    * Download and Save the .zip on your local disk 

1. 👇 Select the .zip in the file selector below (Data and charts will appear after a few seconds).

`
)});
  main.variable(observer("viewof zipFile")).define("viewof zipFile", ["html"], function(html){return(
html`<input type="file" accept=".zip" name="zip-select" />`
)});
  main.variable(observer("zipFile")).define("zipFile", ["Generators", "viewof zipFile"], (G, _) => G.input(_));
  main.variable(observer()).define(["md","activities"], function(md,activities){return(
md`
Extracted **${activities.filter(a => a.transportationMode == 'Air').length} flights** and **${activities.filter(a => a.transportationMode == 'Road').length} car rides** (or equivalent) from your Location History.
`
)});
  main.variable(observer()).define(["vl","activities"], function(vl,activities){return(
vl.layer([vl.markBar()
  .data(activities)
  .encode(
    vl.x().fieldT('datetime').timeUnit('yearmonth').title('Month'),
    vl.y().fieldQ('kCO2e'),
    vl.color().fieldN('transportationMode'),
    vl.tooltip([{field: 'datetime', 'type': 'temporal'}, 'distanceKilometers', 'durationHours']),
  )], [
    vl.markRule()
      .data({ values: [{kCO2e: 400, label: "Monthly kCO2eq budget"}]})
      .encode(
        vl.y().fieldQ('kCO2e'),
        vl.color({value: 'red'}),
        //vl.text().fieldN('label'),
        vl.tooltip([{field: 'label', 'type': 'nominal'}, {field: 'kCO2e', 'type': 'quantitative'}]),
      )
  ],/* [
    vl.markRule()
      .data(activities)
      .transform(
        // How to average the monthly value?
        vl.aggregate(vl.average('kCO2e').as('Average kCO2eq'))
      )
      .encode(
        vl.y().fieldQ('Average kCO2eq'),
        vl.color({value: 'blue'}),
        //vl.text().fieldN('label'),
        vl.tooltip([{field: 'Average kCO2e', 'type': 'quantitative'}]),
      )
  ]*/)
  .width(700)
  .render()
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
Other interesting charts:
`
)});
  main.variable(observer()).define(["vl","activities"], function(vl,activities){return(
vl.markBar()
  .data(activities)
  .encode(
    vl.x().fieldQ('kCO2e'),
    vl.color().fieldN('transportationMode'),
  )
  .title('Total')
  .render()
)});
  main.variable(observer()).define(["vl","activities"], function(vl,activities){return(
vl.markBar()
  .data(activities)
  .transform(
    vl.filter('datum.transportationMode == "Air"')
  )
  .encode(
    vl.x().fieldT('datetime').timeUnit('yearmonth').title('Month'),
    vl.y().count().title('Number of flights'),
  )
  .width(700)
  .render()
)});
  main.variable(observer()).define(["vl","activities"], function(vl,activities){return(
vl.markBar()
  .data(activities)
  .transform(
    vl.filter('datum.transportationMode == "Air"')
  )
  .encode(
    vl.y().count().title('Number of flights'),
    vl.x().fieldQ('kCO2e').bin({maxbins: 5}),
  )
  .render()
)});
  main.variable(observer()).define(["md","printTable","activities"], function(md,printTable,activities){return(
md`
Here are the 10 most impactful flights:
${
//TODO: use https://observablehq.com/@tmcw/tables/2 instead?
printTable(
   activities
    .sort((first, second) => {return first.distanceKilometers > second.distanceKilometers ? -1 : 1 })
    .slice(0,10),
  [
    {field: 'datetime', title: 'Date', align: 'l'},
    {field: 'distanceKilometers', title: 'Distance (km)', align: 'l'},
    {field: 'kCO2e', title: 'kCO2e', align: 'l'},
  ]
)
}`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
## Code
* **License**: This code is under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0) 
* **Author**: Steren Giannini (steren.giannin@gmail.com)
`
)});
  main.variable(observer("JSZip")).define("JSZip", ["require"], function(require){return(
require("jszip@3/dist/jszip.min.js")
)});
  const child1 = runtime.module(define1);
  main.import("printTable", child1);
  const child2 = runtime.module(define2);
  main.import("vl", child2);
  main.variable(observer("zip")).define("zip", ["JSZip","zipFile"], async function(JSZip,zipFile){return(
await JSZip.loadAsync(zipFile)
)});
  main.variable(observer("files")).define("files", ["zip"], function(zip){return(
zip.file(/^Takeout\/Location History\/Semantic Location History\/.*\.json$/)
)});
  main.variable(observer("fileContents")).define("fileContents", ["files"], async function(files){return(
await Promise.all( files.map(f => f.async("string")))
)});
  main.variable(observer("activities")).define("activities", ["fileContents","parseActivities"], function(fileContents,parseActivities){return(
fileContents.map(parseActivities).flat()
)});
  main.variable(observer()).define(["activities","co2e"], function(activities,co2e){return(
activities.forEach(co2e)
)});
  main.variable(observer("parseActivities")).define("parseActivities", function(){return(
function parseActivities(historyStr) {
    
    const weCareAboutActivityType = function(type) {
      return ['FLYING', 'IN_VEHICLE', 'IN_PASSENGER_VEHICLE', 'IN_TAXI'].includes(type);
    }
    
    const weCareAboutActivity = function(activitySegment) {
      return activitySegment && activitySegment.distance && weCareAboutActivityType(activitySegment.activityType);
    }
  
    const activityTypeToTransportationMode = function(type) {
      switch(type) {
        case 'FLYING':
          return 'Air';
        case 'IN_TAXI':
        case 'IN_PASSENGER_VEHICLE':
        case 'IN_VEHICLE':
          return 'Road';
        default: 
          return type;
      } 
    }
    
    /*
     * This function uses heuristics to potentially inject an activityType if not present.
     * E.g. long distance and high average speed should be a flight
     */
    const preProcessActivity = function (activitySegment) {
      const FLIGHT_MIN_DISTANCE_KM = 500;
      const FLIGHT_MIN_AVERAGE_SPEED_KMH = 300;
      const FLIGHT_MAX_AVERAGE_SPEED_KMH = 1000;
      
      const CAR_MAX_DISTANCE_KM = 1000;
      const CAR_MIN_DISTANCE_KM = 50;
      const CAR_MAX_AVERAGE_SPEED_KMH = 130;
      const CAR_MIN_AVERAGE_SPEED_KMH = 50;
      
      // we need duration to compute speed.
      if( !activitySegment
         || !activitySegment.duration
         || !activitySegment.duration.endTimestampMs
         || !activitySegment.duration.startTimestampMs) {
        return;
      }
      
      const speedKmH = function(activitySegment) {
          const km = activitySegment.distance / 1000;
          const h = (activitySegment.duration.endTimestampMs - activitySegment.duration.startTimestampMs) / (1000 * 60 * 60);
         return km / h; 
      }
      
      if(activitySegment.distance > FLIGHT_MIN_DISTANCE_KM * 1000
        && speedKmH(activitySegment) > FLIGHT_MIN_AVERAGE_SPEED_KMH
        && speedKmH(activitySegment) < FLIGHT_MAX_AVERAGE_SPEED_KMH) {
        activitySegment.activityType = 'FLYING';
        return;
      }
      
      if(activitySegment.distance > CAR_MIN_DISTANCE_KM * 1000
        && activitySegment.distance < CAR_MAX_DISTANCE_KM * 1000
        && speedKmH(activitySegment) > CAR_MIN_AVERAGE_SPEED_KMH
        && speedKmH(activitySegment) < CAR_MAX_AVERAGE_SPEED_KMH) {
        activitySegment.activityType = 'IN_PASSENGER_VEHICLE';
        return;
      }
      
    }
  
    const history = JSON.parse(historyStr)
    
    if(!history.timelineObjects) { return; }
    
    let activities = [];
    
    history.timelineObjects.forEach(timelineObject => {
        const activitySegment = timelineObject.activitySegment;
      
        preProcessActivity(activitySegment);
        
        if(weCareAboutActivity(activitySegment)) {
            const activity = {
                id: activitySegment.duration.startTimestampMs,
                datetime: new Date(parseInt(activitySegment.duration.startTimestampMs, 10)),
                durationHours: (activitySegment.duration.endTimestampMs - activitySegment.duration.startTimestampMs) / (1000 * 60 * 60),
                distanceKilometers: activitySegment.distance / 1000,
                activityType: 'ACTIVITY_TYPE_TRANSPORTATION',
                transportationMode: activityTypeToTransportationMode(activitySegment.activityType),
            };
            activities.push(activity);
        }
      
        // For Debug only
        else if(activitySegment 
          && !['WALKING', 'IN_SUBWAY', 'CYCLING', 'SAILING', 'BOATING', 'IN_BUS', 'HIKING', 'IN_TRAIN'].includes(activitySegment.activityType)
          && activitySegment.distance > 100 * 1000
          && (activitySegment.duration.endTimestampMs - activitySegment.duration.startTimestampMs) > 1000 * 60 * 60
        ) {
          console.log(activitySegment);
        }
    })
    return activities;
}
)});
  main.variable(observer("co2e")).define("co2e", function(){return(
function co2e(activity) {
  // Poor man's CO2 model. 
  // This is copy pasting values from the "Transportation" chart at https://www.tmrow.com/climatechange
  // TODO: use better model, import https://github.com/tmrowco/northapp-contrib/tree/master/co2eq
  switch(activity.transportationMode) {
      case 'Air':
        return activity.kCO2e = activity.distanceKilometers * 300 / 1000;
      case 'Road':
        return activity.kCO2e = activity.distanceKilometers * 183 / 1000;
  }
}
)});
  return main;
}
