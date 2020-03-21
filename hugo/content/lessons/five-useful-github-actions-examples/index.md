---
title: Five Useful Github Actions Examples
lastmod: 2020-03-13T09:26:48-07:00
publishdate: 2020-03-13T09:26:48-07:00
author: Jeff Delaney
draft: false
description: Five ways to automate your development process with Github Actions
tags: 
    - github

youtube: eB0nUzAI7M8
github: https://github.com/fireship-io/225-github-actions-demo
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Github Actions make it easy to roll out a [wide variety](https://github.com/sdras/awesome-actions) of DevOps automation tasks. The following lesson provides five examples of CI/CD and automation using [Github Actions](https://github.com/features/actions). 

## Example 1: Continuous Integration

Continuous Integration (CI) automates the process of testing and building your code before merging it. In practice, developers should commit or integrate their changes to the main shared repo once-per-day (or more). 


### Workflow

{{< file "yaml" ".github/workflows/workflow.yml" >}}
```yaml
name: Node Continuous Integration

on:
  pull_request:
    branches: [ master ]


jobs:
  test_pull_request:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v1
        with:
          node-version: 12
      - run: npm ci
      - run: npm test
      - run: npm run build`
```

## Example 2: Continuous Deployment

Continuous *Deployment* (CD) automatically releases new production code to users. It is the step that happens after new code has been integrated. 

See the full [Firebase Deployment with Github Actions Guide](/snippets/github-actions-deploy-angular-to-firebase-hosting/) .


## Example 3: Publish Package to NPM on Release

Do you maintain an open source package? It can be tedious to re-publish your package after creating a new release. Use the next workflow to automatically publish a package to NPM or Github Package Registry. 

### Workflow

{{< file "yaml" ".github/workflows/workflow.yml" >}}

```yaml
name: Sveltefire Package

on:
  release:
    types: [created]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v1
        with:
          node-version: 12
      - run: npm ci
      - run: npm test

  publish-npm:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v1
        with:
          node-version: 12
          registry-url: https://registry.npmjs.org/
      - run: npm ci
      - run: npm build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{secrets.npm_token}}


    publish-gpr:
        needs: build
        runs-on: ubuntu-latest
        steps:
        - uses: actions/checkout@v2
        - uses: actions/setup-node@v1
            with:
            node-version: 12
            registry-url: https://npm.pkg.github.com/
            scope: '@your-github-username'
        - run: npm ci
        - run: npm publish
            env:
            NODE_AUTH_TOKEN: ${{secrets.GITHUB_TOKEN}}
```


## Example 4: Send Email or Chat Messages

Yet another powerful use-case is to post data from Github to your favorite chat or email service, like Slack, Discord, or Twilio SendGrid. 

Also see the lessons about [Building a Slack Bot](https://fireship.io/lessons/how-to-build-a-slack-bot/) and [SendGrid Transactional Email](https://fireship.io/lessons/sendgrid-transactional-email-guide/) with Firebase.

### Workflow

{{< file "yaml" ".github/workflows/workflow.yml" >}}
```yaml
name: Slack Issues

on:
  issues:
    types: [opened]


jobs:
  post_slack_message:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: rtCamp/action-slack-notify@v2.0.0
    env:
        SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
        SLACK_USERNAME: CyberJeff 
        SLACK_CHANNEL: gh-issues
```


## Example 5: Scheduled Background Jobs

You can also run scheduled workflows using [cron](/snippets/crontab-crash-course/). A workflow can even be used to run arbitrary tasks at a set interval. For example, you might generate a weekly report of your code changes and email it to your product managers. 


For a full example, checkout the [Automatic Firestore Backup](/snippets/firestore-automated-backups/) snippet for a breakdown of this use-case. 

