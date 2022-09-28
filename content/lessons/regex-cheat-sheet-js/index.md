---
title: Regex Cheat Sheet
lastmod: 2020-05-18T16:17:00-07:00
publishdate: 2020-05-18T16:17:00-07:00
author: Jeff Delaney
draft: false
description: A collection of useful regular expression techniques and examples for the JavaScript developer. 
tags: 
    - javascript
    - regex


youtube: sXQxhojSdZM
github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

[Regular Expressions](https://en.wikipedia.org/wiki/Regular_expression) are notoriously difficult to learn - they have a very compact syntax that ends up looking like gibberish. However, they can be extremely powerful when it comes to form validation, find and replace tasks, and/or searching through a body of text. The following cheatsheet provides common RegEx examples and techniques for the JavaScript developer. 

🔥 There are several awesome tools that can help you debug RegEx in the browser - my personal favorite is [RegExr](https://regexr.com/). 

## How do you Pronounce RegEx?

Much like Gif vs Jif, the proper pronunciation of RegEx is passionately debated among developers. Based on my limited twitter poll, in looks like most prefer the hard G over the soft J. 

{{< tweet 1262408319282458625 >}}

## Regex Reference

### Basics

- `/ expression / flags`, i.e `/[A-Z]+/g` basic format
- `/ hello\?\*\\/` escape special characters with backslashes
- `()` group with parentheses 
- `|` logical OR

### Character classes

- `\w` word `\d` digit `\s` whitespace (tabs, line breaks)
- `\W` NOT word `\D` NOT digit `\S` NOT whitespace
- `\t` tabs, `\n` line breaks
- `.`	any character (except newline)

### Brackets

- `[xyz]`	match any x, y, z
- `[J-Z]`	match any capital letters between J & Z. 
- `[^xyz]`	NOT x, y, z


### Quantification

- `bob|alice` match bob or alice
- `z?` zero or one occurrences
- `z*`	zero or multiple occurrences
- `z+`	one or multiple occurrences
- `z{n}` n occurrences
- `z{min,max}` min/max occurrences


### Anchors

- `hello world` exact match
- `^hello` start of the strings
- `world$` end of the string

## How to Use RegEx in JavaScript

### Create a Regular Expression

There are two ways to create a regular expression in JavaScript. The literal way is just a set of characters between two forward slashes `/ /`. 

{{< file "js" "regex.js" >}}
```javascript
const re = /foo/; 
```

You can also instantiate `RegExp`. 

```javascript
const re = new RegExp(/foo/);
```

### String Regex Functions

There are several ways to use a regular expression on a string primitive, such as (1) `match` all the occurrences, (2) `search` for the existence of a pattern, or (3) `replace` matches with a new value. 

```javascript
const matches = 'aBC'.match(/[A-Z]/g);
// Output: Array [B, C]

const index = 'aBC'.search(/[A-Z]/);
// Output: 1

const next = 'aBC'.replace(/a/, 'A');
// Output: ABC
```

## Common Examples

### Password Validation

How do you validate the format of a password for a signup form? Let's force passwords to contain a capital letter, lowercase letter, number, and min length of 8. 

{{< file "js" "regex.js" >}}
```javascript
const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g

"1sMyPasswordOK?".search(re);
```

{{< figure src="img/regex-password.png" caption="Validate a password with RegEx (via regexr.com)" >}}

See [full demo](https://regexr.com/3bfsi). 

### Hex Codes

How do you find all of the hex codes, such as CSS colors, in a document? Useful if you need to analyze the color scheme. 

{{< file "js" "regex.js" >}}
```javascript
const re = /#?([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/g

"color: #ffffff; color: #000000;".match(re);
```

{{< figure src="img/regex-hex.png" caption="Find all of the hex codes with RegEx (via regexr.com)" >}}

See [full demo](https://regexr.com/3ag5b). 

### Remove HTML Tags

How do you remove all HTML tags from a document? Use the regex below to find and replace all HTML tags. 

{{< file "js" "regex.js" >}}
```javascript
const re = /(<script(\s|\S)*?<\/script>)|(<style(\s|\S)*?<\/style>)|(<!--(\s|\S)*?-->)|(<\/?(\s|\S)*?>)/g

const sanitized = "<h1>Hello World</h1>".replace(re, '');
```

{{< figure src="img/regex-html.png" caption="Find all HTML tags with RegEx (via regexr.com)" >}}

See [full demo](https://regexr.com/39jba)
