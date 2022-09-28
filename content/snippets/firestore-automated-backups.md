---
title: Automatic Backups for Firestore via Github Actions
lastmod: 2020-03-12T17:20:51-07:00
publishdate: 2020-03-12T17:20:51-07:00
author: Jeff Delaney
draft: false
description: How to implement a daily background job that exports your Firestore data to a storage bucket.
tags: 
    - firebase
    - firestore
    - github

type: lessons
# youtube: eB0nUzAI7M8
# github: https://github.com/fireship-io/225-github-actions-demo
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3
---

As of today, Firestore does not support automatic backups, but it DOES support [exports](https://firebase.google.com/docs/firestore/manage-data/export-import) via the gcloud CLI or REST API. Although not technically a *backup* in database jargon, an automatic export is valuable to have for disaster recovery because it can be re-imported to replace lost data. 

The following snippet exports all Firestore data automatically every day at midnight using a [scheduled Github Action](https://help.github.com/en/actions/reference/events-that-trigger-workflows#scheduled-events-schedule). 


## Generate a Service Key on GCP

We need a service account to grant Github Actions permission to run the export command via the Google Cloud CLI. 

### Grant Permissions to the Service Account

Create a service account on GCP Console with the minimum permissions needed to run the export command. 

{{< figure src="/snippets/img/backup-firestore-service-account.png" caption="Create a service account that has the Cloud Datastore Import Export Admin & Storage Admin permissions" >}}

{{< figure src="/snippets/img/backup-firestore-key-json.png" caption="Download service account JSON file to your local system" >}}

### Save it as a Secret on Github

We can share this data with Github as a secret environment variable. From your Github repo, go to settings > secrets and add a new secret.

{{< file "terminal" "command line" >}}
```text
cat path-to-your-service-account.json | base64
```

Use the command above to convert the JSON service account to a base64 string. 

{{< figure src="/snippets/img/backup-firestore-gh-secret.png" caption="Copy the base64 output as the value of the secret" >}}

## Firestore Backup Github Action

Create the Github Action to run the export job on a schedule.

### Workflow

The workflow below uses a cron schedule to run the export once per day at midnight. GCP has an official action that handles the [setup for gcloud](https://github.com/GoogleCloudPlatform/github-actions/blob/master/setup-gcloud/README.md). 

{{< file "yaml" ".github/workflows/backup.yaml" >}}
```yaml
name: Backup Firestore

on:
  schedule:
    - cron:  '0 0 * * *'

env:
  PROJECT_ID: YOUR-PROJECT
  BUCKET: gs://YOUR-BUCKET
  
jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
    - uses: google-github-actions/setup-gcloud@main
      with:
        service_account_key: ${{ secrets.GCP_SA_KEY }}
        export_default_credentials: true
    - run: gcloud info
    - run: gcloud config set project $PROJECT_ID
    - run: gcloud firestore export $BUCKET
```

### Deploy

Deploy this workflow by simply committing it to the master branch on github. 

{{< file "terminal" "command line" >}}
```text
git add .
git commit -m "backup my firestore data"
git push origin master
```

When the schedule event fires, you should see a successful export job similar to the output below. The exported data will be available in your Firebase storage bucket. 


{{< figure src="/snippets/img/backup-firestore-success.png" caption="Example of successful Firestore export job in Github Actions" >}}