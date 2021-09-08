---
title: Format currency with Intl
lastmod: 2021-07-08T20:00:49-04:00
publishdate: 2021-06-27T20:47:49-04:00
author: Kyle Leary
draft: false
description: Use Intl.NumberFormat() to convert currency, units, notation, and other numeric values
tags: 
    - javascript
    - intl

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
The [Intl.NumberFormat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) object enables language-sensitive number formatting. We can use this to convert currency, numbers, percentages, units, and other notation into formatted strings. This is particularly useful in eCommerce applications, with examples like displaying an item price or recipt printing. Another example are social platforms like [YouTube](https://www.youtube.com/channel/UCsBjURrPoezykLs9EqgamOA), which use compact notation to display high counts of views and followers.

## Currency formatting 

📚 You can reference currency codes [here](https://www.currency-iso.org/en/home/tables/table-a1.html) and locale values [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locale_identification_and_negotiation)

### Number to $USD

{{< file "js" "showMeTheMoney.js" >}}
{{< highlight javascript >}}

const convertToUSD = (someNumber) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(someNumber);
};

// Get dollas in english 🇺🇸
convertToUSD(12.99); // "$12.99"
{{< /highlight >}}

### Number to EURO € 

{{< file "js" "zeigMirDasGeld.js" >}}
{{< highlight javascript >}}

const inEuroUmrechnen = (eineZahl) => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(eineZahl);
};

// Holen sie sich Euro in deutsche 🇩🇪
inEuroUmrechnen(39.99); // "39,99 €"
{{< /highlight >}}

## Compact notation

{{< file "js" "oneMillionSubs.js" >}}
{{< highlight javascript >}}

const subscriberCount = (subscribers) => {
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

{{< file "js" "unitConversion.js" >}}
{{< highlight javascript >}}

const convertToGigabytes = (megabytes) => {
  return new Intl.NumberFormat("en-US", {
    style: "unit",
    unit: "gigabyte",
    maximumSignificantDigits: 4,
    unitDisplay: "narrow"
  }).format(megabytes / 1000);
};

// 💾 Convert MB value to GB:
convertToGigabytes(77778); // "77.78GB"
{{< /highlight >}}

### 🔥 BONUS EXAMPLE 🔥

{{< file "js" "getStorageBill.js" >}}
{{< highlight javascript >}}

// Example monthly Firebase storage used:
const stored = convertToGigabytes(77778); // "77.78GB"

// 5GB Free tier monthly allowance:
const free = 5;

// Calculate total Firebase storage bill:
const billable = (parseFloat(stored) - free); // 72.78

// Format total using currency conversion
const totalBill = convertToUSD(billable * 0.026); // "$1.89"
{{< /highlight >}}

### Temperature conversion

{{< file "js" "tempConversion.js" >}}
{{< highlight javascript >}}

// 🌡 Convert tempertaure to °C or °F:
const convertTemp = (unit, degrees) => {

  // Handle output based on unit input:
  switch (unit) {
    case "celsius":
      degrees = ((degrees - 32) / 1.8000);
      break;
    case "fahrenheit":
      degrees = ((degrees * 1.8000) + 32);
      break;
  }

  return new Intl.NumberFormat("en-US", {
    style: "unit",
    unit: unit,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(degrees);
};

// °C → 🥶 → °F
convertTemp("fahrenheit", 21); // "69.80°F"

// °F → 🔥 → °C
convertTemp("celsius", 97); // "36.11° C"
{{< /highlight >}}

You can learn more about [Intl.NumberFormat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat), the [Internationalization](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) API, and the [ECMAScript](https://402.ecma-international.org/1.0/#sec-11.1) specification for all the properties, values, and methods available on [MDN](https://developer.mozilla.org/)
