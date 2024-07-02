---
title: Cron Jobs
description: Run background processes on a schedule with Cron
weight: 20
lastmod: 2024-06-15T11:11:30-09:00
draft: false
vimeo: 973160667
emoji: ⏰
video_length: 4:08
---

## Edit a Cron Schedule

I highly recommend using tools like [Crontab Guru](https://crontab.guru/#20_4_*_*_5) for generating cron schedules. 


## How to Start a Cron Job in Linux

Create a basic bash script to run in the background:

{{< file "terminal" "command line" >}}
```bash
nano hello.sh

# echo "hello world!"

realpath hello.sh # get the full path of the file
```

Start the cron service and edit the crontab file:

{{< file "terminal" "command line" >}}
```bash
sudo service cron start

crontab -e
```

Edit the crontab file with the path to your bash script:

```
* * * * * /mnt/d/apps/linux-playground/hello.sh
```

Verify that the cron job is running:

{{< file "terminal" "command line" >}}
```bash
crontab -l
sudo grep CRON /var/log/syslog
sudo grep CRON /var/log/cron
```
