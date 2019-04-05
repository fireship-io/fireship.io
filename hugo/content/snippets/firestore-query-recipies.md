---
title: Firestore Security Rules Cookbook
publishdate: 2019-01-02T09:35:09-07:00
lastmod: 2019-01-02T09:35:09-07:00
draft: false
author: Jeff Delaney
type: lessons
description: Common Recipes and Techniques for Querying the Firestore Database
tags:
    - firebase
    - firestore
---


The purpose of this snippet to provide examples of common [Firestore Database Queries](https://firebase.google.com/docs/firestore/query-data/queries) and techniques. 




Jason baisden So man...thought I was getting the hang of Cloud Firestore. I have an object, LearningNote. Each LearningNote correlates to a goal. I've set this up in my code such that LearningNote has a property of type Goal. So now my LearningNote service is querying my Goal service for each object returned. In Firestore, LearningNote and Goals are their own collections. Any thoughts on how to tidy this up? Is this the "right" way to do it? I've thought about making LearningNotes a child collection of Goals, but am still wondering how I'd get the goal information for each learning note.

alterNerDive hey pro-members, what is the better solution:
I have 1 collection with articles, articles-doc has a field `type` and could have value A or B.
On one site, i load this collection and build 2 lists, 1 for `type===A` and 1 for `type===B`.

What is the better solution:
Load whole collection and filter on template with `*ngIf="article.type===A"` or load data 2 times with filter in query?


Anyone have a firestore solution for indexes and tagging when you're querying with tags (setup as based boolean maps) and ordering by something like updatedAt?  I have a collection of documents that can have any number of topic based tags.  I can query documents that match multiple tags until I try and order the documents and then Firebase wants to create a index for each tag (which is not viable).  Any suggestions much appreciated.