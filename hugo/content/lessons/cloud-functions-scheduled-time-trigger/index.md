---
title: Dynamic Scheduled Background Jobs in Firebase 
lastmod: 2019-04-20T07:44:49-07:00
publishdate: 2019-04-20T07:44:49-07:00
author: Jeff Delaney
draft: false
description: Trigger Cloud Functions based on cron time intervals and create a task queue for dynamically scheduled jobs. 
tags: 
    - cloud-functions
    - pubsub
    - firebase

youtube: h79xrJZAQ6I
github: https://github.com/fireship-io/181-cloud-functions-task-queue
# disable_toc: true
# disable_qna: true

# courses
# step: 0

versions:
   firebase-functions: 2.3.0
   firebase-tools: 6.7.0
---

Last week, Firebase announced a new scheduled [cron trigger for Cloud Functions](https://firebase.googleblog.com/2019/04/schedule-cloud-functions-firebase-cron.html) that makes it easy to run serverless code on a set time interval. This function type is special because it combines the powers of [Cloud Scheduler](https://cloud.google.com/scheduler/) and [Pub/Sub](https://cloud.google.com/pubsub/docs/overview) to guarantee security that you don't have with a regular HTTP-triggered function. 


Scheduling a function on a static time interval is straight forward, but what if you want to build a dynamic task queue where users can schedule their own background jobs? For example, you might want to...

- allow users to customize times for transactional email delivery
- schedule push notifications or similar alerts dynamically
- enqueue background jobs to run at specific times
- build robocallers 🤣 - please don't

## Basic Scheduled Function

Let's start by looking at an example of a basic cron-scheduled Cloud Function. 

Make sure you have the latest version of [firebase-tools](https://firebase.google.com/docs/cli/) (or at least version 6.7) installed on your system, then initialize a new project. 

Learn more about [cron schedules](/snippets/crontab-crash-course). 

{{< file "terminal" "command line" >}}
{{< highlight text >}}
npm i firebase-tools@latest -g

firebase init functions
{{< /highlight >}}

A basic scheduled Cloud Function can be defined on the `pubsub` namespace. 

{{< file "typescript" "index.ts" >}}
{{< highlight typescript >}}
export const dailyJob = functions.pubsub

   .schedule('30 5 * * *').onRun(context => {
      console.log('This will be run every day at 5:30AM');
   });

export const everyFiveMinuteJob = functions.pubsub

    .schedule('every 5 minutes').onRun(context => {
        console.log('This will be run every 5 minutes!');  
     });
{{< /highlight >}}

## Dynamic Task Queue

Our task queue or job queue is simply a Firestore collection that will be queried by a Pub/Sub Cloud Function every 60 seconds. If the current time is greater than the *performAt* time of a task, then we execute it. 

{{< figure src="img/task-queue-firebase.png" caption="The task queue query expired tasks on each tick, then execute the business logic associated with the task worker field" >}}


### Step 1: Data Model for Background Jobs

A *task* is a generic document that tells the Cloud Function how to run the backgorund code.  

- `performAt` when to execute the task as a Firestore timestamp. 
- `status` the state of the tasks, useful for debugging and/or querying. 
- `worker` the name of worker function, which contains the business logic to execute. See step 3.
- `options` a map containing extra data for the worker function, like a userID argument for example.


```
tasks/{taskID}/

   performAt: TimeStamp
   status: 'scheduled' | 'complete' | 'error'
   worker: string 
   options: Map
```

{{< figure src="img/task-queue-data-model.png" caption="Tasks represent a simple data model for calling JS functions and passing data to our backend code" >}}


### Step 2: Task Runner Cloud Function

{{< box icon="scroll" class="box-green" >}}
#### Pro Tips

This function will be invoked approx 45,000 times per month, but it can complete multiple tasks per run. Firebase provides 125K free invocations per month. 

Max out the memory and timeout settings for your function. This will ensure the task runner can handle large batches of jobs in a single run. 
{{< /box >}}

Next, we need to define a Pub/Sub Cloud Function that queries the task collection every 60s (or whatever granularity you want) for tasks that are ready to perform. 

{{< file "typescript" "functions/src/index.ts" >}}
{{< highlight typescript >}}
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
const db = admin.firestore();

export const taskRunner = functions.runWith( { memory: '2GB' }).pubsub

    .schedule('* * * * *').onRun(async context => {

        // Consistent timestamp
        const now = admin.firestore.Timestamp.now();
        
        // Query all documents ready to perform
        const query = db.collection('tasks').where('performAt', '<=', now).where('status', '==', 'scheduled');

        const tasks = await query.get();


        // Jobs to execute concurrently. 
        const jobs: Promise<any>[] = [];

        // Loop over documents and push job.
        tasks.forEach(snapshot => {
            const { worker, options } = snapshot.data();

            const job = workers[worker](options)
                
                // Update doc with status on success or error
                .then(() => snapshot.ref.update({ status: 'complete' }))
                .catch((err) => snapshot.ref.update({ status: 'error' }));

            jobs.push(job);
        });

        // Execute all jobs concurrently
        return await Promise.all(jobs);

});
{{< /highlight >}}


Keep in mind, this is a compound query that will require a Firestore index. 

{{< figure src="img/background-job-index.png" caption="The query requires an index with status Ascending and performAt Ascending" >}}



### Step 3: Define Worker Functions to Run Jobs

Now that we have a working function in place, we can define the business logic (worker functions) that execute a task. 

{{< file "typescript" "functions/src/index.ts" >}}
{{< highlight typescript >}}
// Optional interface, all worker functions should return Promise. 
interface Workers {
    [key: string]: (options: any) => Promise<any>
}

// Business logic for named tasks. Function name should match worker field on task document. 
const workers: Workers = {
    helloWorld: () => db.collection('logs').add({ hello: 'world' }),
}
{{< /highlight >}}


Run `firebase deploy --only functions`. 

After the function is deployed we just need to create a task document in Firestore that points the `helloWorld` worker. Within 1 minute you should see the task document update to *complete* 



