---
title: Firestore Security Rules Cookbook
publishdate: 2019-01-02T09:35:09-07:00
lastmod: 2019-01-02T09:35:09-07:00
draft: true
author: Jeff Delaney
type: lessons
description: Common Recipes and Techniques for Querying the Firestore Database
tags:
    - firebase
    - firestore
---


The purpose of this snippet to provide examples of common [Firestore Database Queries](https://firebase.google.com/docs/firestore/query-data/queries) and techniques. 


### Calendar
Alfredo Perez [8:15 AM]
It will be interesting to see your approach to model a Kickstarter app (messaging, finding projects, updates) and also how to do a  model for calendly. Check for free time slots, show calendar, link to other users


### Language



Jason baisden So man...thought I was getting the hang of Cloud Firestore. I have an object, LearningNote. Each LearningNote correlates to a goal. I've set this up in my code such that LearningNote has a property of type Goal. So now my LearningNote service is querying my Goal service for each object returned. In Firestore, LearningNote and Goals are their own collections. Any thoughts on how to tidy this up? Is this the "right" way to do it? I've thought about making LearningNotes a child collection of Goals, but am still wondering how I'd get the goal information for each learning note.

## Blockchain Bucketing Large Documents

Ben Nakaska [6:59 PM]
Hey Jeff.
Just wanted to give you a heads up, since I don’t think you meant to do this:


### Tags
alterNerDive hey pro-members, what is the better solution:
I have 1 collection with articles, articles-doc has a field `type` and could have value A or B.
On one site, i load this collection and build 2 lists, 1 for `type===A` and 1 for `type===B`.

What is the better solution:
Load whole collection and filter on template with `*ngIf="article.type===A"` or load data 2 times with filter in query?


Anyone have a firestore solution for indexes and tagging when you're querying with tags (setup as based boolean maps) and ordering by something like updatedAt?  I have a collection of documents that can have any number of topic based tags.  I can query documents that match multiple tags until I try and order the documents and then Firebase wants to create a index for each tag (which is not viable).  Any suggestions much appreciated.

### ACL, Role-based Permission
### Tree

Earl Wagner [8:11 AM]
1. Org/business/Group with many members, roles, and/or permissions. 
-What does the org signup flow look like?
 -User signs up then creates an org and becomes an admin?
 -Org created during sign up?
-How do orgs add members?
-How do users request to join?

2. Dynamic Tree Sidebar Navigation tied to Firestore and router.

## Complex Joins
Lenny Cunningham [8:02 AM]
Its not truly production, but I've been working on a helicopter ems "HEMS" flight planning tool. Uses your geofirex and the FAA's obstacle database. Thats the one I was asking about finding coords in a bbox not a radius.   https://flightnow.net

Then one that is truly complicated is a Job and Tool Management System I've been working on for a drilling company.  Because you have to track every aspect of traceability for items that go downhole when drilling.  From where the material was milled at for each part that is built into an assembly and then shipped.  It's pretty extensive joining of information. That would actually be a good one. It has all the types of data relationships you talk about.  One to one, through many to many.


## GeoLocation
lucanise [4:28 PM]
I'm working on an app for mobile ordering for a chain of cafes my biggest difficulty is suggesting the closest one based on comparing the distance between the user and the stored cords for the cafe
I'n SQL this could be done in a single query but in firebase i havent been able to find a server side way to do this
hope this inspires something for the video! looking forward to the tips :grin:


## Full Text Search
Marc_V [8:36 AM]
So I know you have covered some algolia stuff but would love to see the best practice/most efficient way to update an algolia index that is directly linked to a firestore collection and runs a cloud function automatically when a a doc is newly written or existing doc is updated to that specific collection to maintain live updating between the front end and the algolia related index that can be searched on to help alleviate doc reads as opposed to a user reading a collection if they were searching directly into firestore without algolia...for example -> let’s say a new user creates an account(firestore doc)..they need to be instantly searchable through your algolia index instance...this is challenging as you need to watch your writes in firestore and in algolia as well!!! Would love to see what you would propose to make this efficient for let’s say a large production app!!!! Boom! Thanks Jeff!

It’s a little out of context for what you’re looking to cover but if you pick something else...how would you suggest handling it regardless?


## Permission
Sam Redmond [8:19 AM]
Hey Jeff, recently I've been working on a project for personal trainers to be able to take on trainees and manage their diet, workout regiment, and see all their trainees' stats (i.e. weight loss over time, calorie intake over time, etc). This is mostly done with Firestore. Trainers and Trainees are stored in separate collections, as is the trainee info, and I have been working on a way for a trainee to be able to sign up with a trainer and share their info ONLY with the trainers they are signed up for. Basically, what I came up with was having a TraineeInfo collection, and the documents inside have both a TraineeId and TrainerId so I can structure the rules so that only the specified people are able to look at the data. What I have to do now is account for multiple trainers being authorized (like if someone wanted a nutritionist and a physical trainer)


## Tag 2

samrat_bhandari [8:04 AM]
Hi Jeff, from your latest announcement on firestore data modelling, I would love to see your implementation of :

Content discovery by tags (for example, user A tags user B in a document and we should be able to notify user B, search/filter document by tags, etc)

I thought that would be a good video idea for building up on

You also did a video on draggable arrays, would love to see the data modelling needed to custom order documents based on users drag list



## Country Stuff
scssat [12:02 PM]
Hi Jeff,
Here is a challenge, hope you understand:
1: Users are from multiple countries. Each user should only see data from the country he belongs to.
2: Each country has a set of libraries, like list of nutrition, medicines etc. These libraries should only be visible to the users from the specific country.
3: Some data for users from a specific country, like e.g. blog posts will be stored in Alogolia in indices split by country. When a user search for data in Algolia, the user will only see results from the country he belongs to.

### Roles2

Sönke Ohls
I plan to collect data (think of a checkout) when purchasing in a shop. So I have users that can have different roles, like cashier, shop manager, company owner, or customer in that shop. I have companies that can have many shops. I collect data per company, shop, customer and who was the cashier.

Basically you can think of a mobile phone checkout in a local shop.

Everyone can imagine the example.

Value: Think of a bakery with many local shops. The shop owner can see what was shopped where in real time and shift goods from one shop to the other if supply and demand is out of balance. The goods are worth nothing the next day...

## Translation2
Stéphane Dondyas [8:30 AM]
Hi Jeff! Hope you're fine!
It's about firestore data modeling. I've worked on a ecommerce website with firestore as backend. Products sold in the website are available in specific countries with their own prices, quantities, sizes and colors. Eg: France the product cost 30€, there is 10 size medium color red, 10 size medium color blue, 10 size large color red, ... .
And each are different from a country to another. And we can query products with these parameters. So clients can manage their products in different countries and have detailed statistics on sales.

In my case, a have a collection of products, each product has a field named countries, which is an object that contains data for each countries where the product is available


I hope you understand what means i don't speak English fluently.

Thank you. (edited) 


## Middle Man
Yulian [8:09 AM]
I don't know whether you'll find this use-case useful but we had a couple of subcollections in our `users` collection, such as `transactions`, `shipments`, etc. At some point in time we had to build webhooks that will update different fields in the documents within these subcollections. However, the third-party service had its own `id` fields that were of course different from ours and didn't allow adding extra fields to their model so it was impossible to match our `transactions` with the data coming through the webhooks.

For this reason, we created a "root" collection for `transactions` that stored only three values `thirdPartyId`, `accountId`, `transactionId`. This way we could match our internal subcollection with the incoming webhook data.

Hope this one is worth sharing! (edited) 