---
title: Five Useful Github Actions Examples
lastmod: 2020-03-13T09:26:48-07:00
publishdate: 2020-03-13T09:26:48-07:00
author: Jeff Delaney
draft: false
description: Five ways to automate your development process with Github Actions
tags: 
    - github
    - 

# youtube: 
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Github Actions make a [wide variety](https://github.com/sdras/awesome-actions) of DevOps tasks much easier to implement. The following lessons looks at five powerful use-cases for CI/CD and automation using Github Actions. 

## Example 1: Continuous Integration

Continuous integration automates the process of testing and building your code before merging it. In practice, developers should commit or integrate their changes to the main shared repo once-per-day (or more). 

Most node projects run a test command 

{{< file "npm" "package.json" >}}
```json
"scripts": {
    "test": "jest",
}
```

### Workflow

- Runs on every pull request to the master branch. 
- 

## Example 2: Continuous Deployment

- Runs on every merge to the master branch
- 

## Example 3: Publish Package to NPM on Release

Do you maintain an open source package? It can be tedious to re-publish your package after creating a new release. 

## Example 4: Send Email or Chat Messages

Yet another powerful use-case is to post data from Github to your favorite chat or email service, like Slack, Discord, or Twilio SendGrid. 

## Example 5: Scheduled Background Jobs

You can also run scheduled workflows using [cron](/snippets/crontab-crash-course/). A workflow can even be used to run arbitrary tasks at a set interval. For example, you might generate a weekly report of your code changes and email it to your product managers. 


For a full example, checkout the full [Automatic Firestore Backup](/snippets/firestore-automated-backups/) for a full breakdown of this use-case. 

