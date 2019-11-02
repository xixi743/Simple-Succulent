// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

export function metersToMiles(meters) {
  let miles = meters/1609.344;
  let rounded_miles = miles.toFixed(2);
  return rounded_miles;
}