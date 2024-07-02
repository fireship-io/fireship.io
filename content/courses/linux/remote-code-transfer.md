---
title: Code Transfer
description: How to upload code to a VPS
weight: 34
lastmod: 2024-06-20T11:11:30-09:00
draft: false
vimeo: 974265360
emoji: 🍴
video_length: 3:09
---

## Install Node.js

In order to run the app, we will need Node.js installed in the VPS. 

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

nvm install 20
```
## Git Clone to VPS 

Note: If using your own code, you will first need to push your code to a remote repository on GitHub. 

```bash
cd apps
git clone https://github.com/fireship-io/linux-course guestbook

cd guestbook

npm install
npm run build

curl http://localhost:3000
```

In a separate terminal session, also run Pocketbase:

```bash
sudo chmod +x pocketbase
./pocketbase serve
```

## Secure Copy

As an alternative, you can copy the raw files from your local machine to the remote machine.

```bash
scp -r /path/to/local/code root@123.45.67.89:/apps/guestbook
```



