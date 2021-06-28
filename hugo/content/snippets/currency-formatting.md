---
title: Format currency using Intl.NumberFormat
lastmod: 2021-06-27T20:47:49-04:00
publishdate: 2021-06-27T20:47:49-04:00
author: Kyle Leary
draft: false
description: Currency and number formatting based on locale using Intl.NumberFormat
tags: 
    - javascript

# youtube: 
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3

type: lessons
---
The [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) object enables language-sensitive number formatting. We can use this to convert currency, numbers, percentages, units, and other notation into formatted strings. This is particularly useful in eCommerce applications and social platforms like [Twitter](https://twitter.com/fireship_dev) or [YouTube](https://www.youtube.com/channel/UCsBjURrPoezykLs9EqgamOA) where counter values can be in the millions.

## Currency formatting 

You can reference currency codes [here](https://www.currency-iso.org/en/home/tables/table-a1.html) and locales [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locale_identification_and_negotiation)

### Number to $USD

{{< file "js" "showMeTheMoney.js" >}}
{{< highlight javascript >}}

function convertToUSD(someNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(someNumber);
};

// Get dollas in english
showMeTheMoney(12.99); // "$12.99"
{{< /highlight >}}

### Number to EURO € 

{{< file "js" "showMeTheMoney.js" >}}
{{< highlight javascript >}}

function inEuroUmrechnen(eineZahl) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(eineZahl);
};

// Get Euros in Deutsche
inEuroUmrechnen(717.23); // "717,23 €"

{{< /highlight >}}

## Compact notation

{{< file "js" "oneMillionSubs.js" >}}
{{< highlight javascript >}}

// 📹 YouTube subscribers
function subscriberCount(subscribers) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
  compactDisplay: "short"
  }).format(subscribers);
};

// 📼 Current Fireship subscribers 
subscriberCount(711000); // "711K"

// 🔥 Fireship subscriber goal for 2021
subscriberCount(1000000); // "1M"
{{< /highlight >}}

### Unit conversion

{{< file "js" "howMuchData.js" >}}
{{< highlight javascript >}}

// MB to GB
function getGigabytes(megabytes) {
  return new Intl.NumberFormat("en-US", {
    style: "unit",
    unit: "gigabyte",
    maximumSignificantDigits: 4,
    unitDisplay: "narrow"
  }).format(megabytes / 1000);
};

// Return the value in GB:
getGigabytes(77778); // "77.78GB"

// 🔥 BONUS 🔥 //

// Firebase storage used this month:
const storedGB = getGigabytes(77778);

// 5GB Free tier monthly allowance:
const freeTier = 5;

// Calculate total Firebase storage bill:
const billableData = (parseInt(storedGB) - freeTier);

// Format total using currency conversion
convertToUSD(billableData * 0.026); // $1.87

{{< /highlight >}}

### Temperature conversion

{{< file "js" "tempConversion.js" >}}
{{< highlight javascript >}}

// 🌡 Convert celsius or farenheit:
function returnTemp(unit, degrees) {

  // Handle login based on the unit
  
  switch (unit) {
    case "celsius":
      degrees = ((degrees - 32) / 1.8000);
      break;
    case "fahrenheit":
      degrees = ((degrees * 1.8000) + 32);
      break;
    default: // "fahrenheit"
      degrees = ((degrees * 1.8000) + 32);
      break;
  }

  return new Intl.NumberFormat("en-US", {
    style: "unit",
    unit: unit,
    maximumFractionDigits: 2
  }).format(degrees);

};

// °C → 🥶 → °F
returnTemp("fahrenheit", 21); // "69.8°F"

// °F → 🔥 → °C
returnTemp("celsius", 97); // "36.11° C"
{{< /highlight >}}

Learn more about [Intl.NumberFormat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat), the [Internationalization](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)API, and the [ECMAScript](https://402.ecma-international.org/1.0/#sec-11.1) specification for all the properties, values, and methods available!
