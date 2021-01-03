---
title: Top 7 Security Concepts for Web Developers
lastmod: 2020-02-13T09:37:39-07:00
publishdate: 2020-02-13T09:37:39-07:00
author: Jeff Delaney
draft: false
description: Security concepts, risks, and exploits that every web developer should know about. 
tags: 
    - javascript
    - security

youtube: 4YOpILi9Oxs
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Cloud providers and web application frameworks go to great lengths to protect you from writing insecure code. The Cloud provides secure defaults and monitoring for your infrastructure, while Angular and React automatically sanitize HTML to prevent the injection of malicious JavaScript. Despite these safeguards, no application is 100% secure and clever new exploits will be discovered. The following lesson explains some of the most common hacking techniques and how to secure your app against them. 

## 1. Zero-day Vulnerability

A **zero-day vulnerability** is a weakness that is unknown or unfixed as of today. When a hacker decides to attack this weakness, it's called **zero-day exploit**. 

After it becomes known, you can think of it as a one-day or 20-day exploit based on the time since initial discovery. 

## 2. Packages with Known Vulnerabilities

> In 2017, the [Equifax Data Breach](https://www.cnet.com/news/equifax-ceo-data-breach-heres-what-went-wrong/) exposed more than 140MM customer records and has cost the company over $1 billion. It was caused by a known exploit over two months old that could have been prevented with a simple update to Apache Struts. 

Using packages with [known vulnerabilities](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A9-Using_Components_with_Known_Vulnerabilities) is the most common way hackers exploit web apps. 

Audit your current NPM project using the [audit](https://docs.npmjs.com/cli/audit) command. Then update your dependencies as needed.  

{{< file "terminal" "command line" >}}
{{< highlight text >}}
npm audit

npm audit fix
{{< /highlight >}}


## 3. Cross-site Scripting (XSS)

> The Samy worm was an XSS attack that spread to over 1 million MySpace pages in 24 hours. If affected, it would updated your profile to say *but most of all, samy is my hero*

<div class="insta">

</div>


Cross Site Scripting occurs when a hacker runs malicious JavaScript on a client's browser. In can happen in a variety of ways, but is commonly the result of rendering raw HTML from the server. 

{{< figure src="img/xss-diagram.png" caption="A diagram of a typical Cross Site Scripting attack" >}}

1. Hacker saves some JS code to the database like `<script>alert('you got got')</script>` by submitting a comment via the web app. 
2. The victim user visits the webpage with that comment, but the developer did not sanitize the hackers comment, so the browser thinks it's a trusted script/html. 
3. At this point, the hacker's JS is running as if it were the end-user. 

## 4. SQL Injection

> In 2008, Heartland Payment Systems exposed the data encoded on credit cards via a SQL injection attack. The hackers used this data to make physical counterfeit credit cards. The ringleader, Albert Gonzalez, was caught and sentenced to 20 years in prison. 

[SQL injection](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection) is similar conceptually to XSS, but instead it runs malicious code on the database. 

Notice how the code below relies on an external parameter to construct the query. If not not sanitized, an attacker can submit raw SQL code and the database will execute it. 

{{< highlight sql >}}
"SELECT * FROM users WHERE uid='" + request.getParameter("uid") + "'";
{{< /highlight >}}


Most ORMs will prevent SQL injection attacks because you do not construct the queries on your own. However, there have been hacks on ORMs directly, so again, nothing is 100% secure. 

## 5. Credential Leaks

Many APIs and Cloud Providers provide API keys that allow you to interact with paid services. If a hacker discovers a secret API key it can be used to take destructive action on your behalf. There are a few ways credentials are leaked.

1. Using API keys directly in source code, then pushing the repo to Github. 
1. Using API keys directly in source code, then bundling them in your production app. 

You can prevent credential leaks by NOT putting them in your source code. Instead, use environment variables or a service like [Secret Manager](https://cloud.google.com/secret-manager/docs). 


## 6. Principle of Least Privilege

In the event that your credentials are compromised, you can mitigate the damage by following the Principle of Least Privilege. Basically, this means **grant access only when it is absolutely required**. 

A good example is [Firestore Database Rules](/snippets/firestore-rules-recipes/), which allow you to customize the permissions of an API key. When defining rules, you should always start by locking down everything, then selectively allow access as needed. 

## 7. DDoS Attacks

> In 2018, Github survived the largest DDoS attack in history after it was bombarded with 1.35 terabits of data per second. It only took the site down for about ten minutes thanks to a backup service, Akamai, which re-routed traffic and blocked the spoofed requests. 

A [DDoS](https://en.wikipedia.org/wiki/Denial-of-service_attack) attack attempts to flood the a service with so much traffic that it simply shuts down. The attack is typically distributed via many spoofed sources, making it impossible to just block a single IP address. 

For most developers, the best mitigation strategy is to use a large Cloud provider that has the bandwidth and monitoring capabilities to deal with such attacks. 