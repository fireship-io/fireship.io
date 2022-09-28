---
title: Database Model
description: Model relationships between quiz entities in Firestore
weight: 40
lastmod: 2021-11-11T10:23:30-09:00
draft: false
vimeo: 645765586
emoji: 💽
chapter_start: Firestore
video_length: 3:00
---

In order to build an app identical to the live demo, you need to populate Firestore with data. 

## Task: Populate your Database with Quiz Data

I recommend cloning the [Quiz Questions Repo](https://github.com/fireship-io/fireship-quizapp-data). It is a node script that allows you to populate all the quiz data in your own database with a single command.

At the very least, create the following documents from the schema images below.

1. One document located at `topics/my-topic`. 
1. One document located at `quizzes/my-quiz`.

## Database Model

You can also create your own data from scratch. Below you will find screenshots of sample quiz data for each collection. 

### Topics

{{< figure src="/courses/flutter-firebase/img/topic-datamodel.png" caption="Topics collection data model" >}}

### Quizzes

{{< figure src="/courses/flutter-firebase/img/quiz-datamodel.png" caption="Quiz collection data model" >}}


### User Report

{{< figure src="/courses/flutter-firebase/img/report-datamodel.png" caption="Report collection data model" >}}

