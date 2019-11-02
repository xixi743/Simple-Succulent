import clock from "clock";
import document from "document";
let document = require("document");
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { battery } from "power";
import userActivity from "user-activity";
import {me as appbit } from "appbit"; //permissions

var months = {0: "Jan", 1: "Feb", 2: "Mar", 3: 'Apr', 4: "May", 5: 'Jun',
              6: "Jul", 7: "Aug", 8: "Sep", 9: "Oct", 10: "Nov", 11: "Dec"}; 

var weekdays = {1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: 'Sat', 0: 'Sun'};

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const myClock = document.getElementById("myClock");
let dateLabel = document.getElementById("dateLabel");
let chargeLabel = document.getElementById("chargeLabel");
let myHR = document.getElementById("hrm");
let steps = document.getElementById("steps");
let distance = document.getElementById("distance");
let calories = document.getElementById("calories");

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  };
  
  let mins = util.zeroPad(today.getMinutes());
  myClock.text = `${hours}:${mins}`;
  
  let month = months[today.getMonth()];
  let weekday = weekdays[today.getDay()];
  let day = today.getDate();
  dateLabel.text = `${weekday}, ${month} ${day}`;
  
    
  let charge = Math.floor(battery.chargeLevel);
  chargeLabel.text = `${charge}%`;
  
  if(appbit.permissions.granted("access_activity")) {
    steps.text = userActivity.today.adjusted.steps;
    calories.text = userActivity.today.adjusted.calories;
    let meters = userActivity.today.adjusted.distance;
    distance.text = util.metersToMiles(meters);
  }

}

myHR.text = "--"; // initialize HR with some values

if (HeartRateSensor && appbit.permissions.granted("access_heart_rate")) {
  const hrm = new HeartRateSensor();
  hrm.addEventListener("reading", () => {
    myHR.text = hrm.heartRate;
  });
  display.addEventListener("change", () => {
    // auto stops the sensor when the screen is off to conserve battery
    display.on ? hrm.start() : hrm.stop();
  });
  hrm.start()
}


