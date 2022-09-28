---
title: Use Coder to Run VS Code on Google Cloud
lastmod: 2019-03-31T05:49:52-07:00
publishdate: 2019-03-31T05:49:52-07:00
author: Jeff Delaney
draft: false
description: Run VS Code on Google Cloud and configure it for remote frontend development. 
tags: 
    - vscode
    - gcp

youtube: N5WojMutddQ
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Turning [VS Code](https://code.visualstudio.com/) into a full IDE requires you to carefully blend your favorite extensions and packages for the type of development work you perform. It can take hours or even days to get your development environment fine-tuned for optimal productivity. But what happens upgrade to a new computer? Or need to share your IDE with somebody on the other side of the world? Or maybe you just need more compute resources... 

The following lesson will teach you how to use [Coder](https://coder.com/) - a tool that allows you to run VS Code on any cloud and access it from the browser. We will take their open source project [code-server](https://github.com/codercom/code-server) and use it to run VS Code on Google Cloud Platform. 

## Run Coder VS Code On GCP

### Create a VM

First, we need to spin up a virtual machine instance on [Google Compute Engine](https://cloud.google.com/compute/). The recommended VM will cost about $0.067 per hour or $48.95 per month. Keep in mind, you can shut down the VM at anytime and billing will be calculated pro-rata to the second. The recommended OS is Ubuntu 16.04. 

{{< figure src="img/coder-gcp-settings.png" caption="The recommended VM settings for Coder on GCP" >}}

### SSH into your VM

Now we need to interact with the VM from the command line. Go to the instance details page and click on the SSH button. 

{{< figure src="img/vm-open-ssh.png" caption="Start an SSH session with your Google Cloud VM"  >}}


Find the [latest release of Code Server](https://github.com/codercom/code-server/releases/latest), then download and unzip the release into the VM's file system with the following commands: 

{{< file "terminal" "command line" >}}
```text
wget https://github.com/codercom/code-server/releases/download/{version}/code-server-{version}-linux-x64.tar.gz
tar -xvzf code-server-{version}-linux-x64.tar.gz
```

Execute the binary to start serving VS Code on port 80.

```text
cd code-server-{version}-linux-x64
sudo ./code-server -p 80
```


### Access the VS Code on the Web

At this point we have a process for VS Code running and can access it from the web. Find the link to the external IP for the VM, then navigate to it on port 80, for example *https://your-ip-address:80*

{{< figure src="img/vm-ip-link.png" caption="Click on the external IP link" >}}


Initially, you will see this warning from the browser. Click *Advanced -> Proceed Anyway*

{{< figure src="img/vscode-web-warning.png" caption="This is not actually unsafe because we own the VM" >}}

You need a password to access the editor, which was automatically generated in the terminal output. 

{{< figure src="img/coder-password.png" caption="Copy the password in the middle of the terminal output" >}}

After entering the password you should have access to VS code in the browser. 

{{< figure src="img/vscode-coder-demo.png" caption="Done! Access VS Code and your files from any device, anywhere!" >}}

## Frontend Development Configuration

After you have VSCode up and running in the cloud, you will likely want to configure it for frontend development with Angular, React, Vue, etc. Currently, we just have a bare bones VM without Node or NPM installed. 

### Install Node

Follow these instructions to [install NodeJS](/snippets/install-nodejs/). This will give you access to the `nvm` command for version management and the `npm` command for package management. 

{{< file "terminal" "command line" >}}
```text
nvm install 10

npm install @angular/cli -g
```


### Serving a Frontend Application on GCP Compute Engine

By default, GCP only exposes port 80 to inbound TCP traffic. That means if you try to run `ng serve` for Angular, which serves the app on port 4200 for example, it will not be accessible. Generally, I like to serve traffic on port 8080, and we can allow this by setting up a firewall rule like so. 

{{< file "terminal" "command line" >}}
```text

ng new my-app
cd my-app
ng serve --port 8080
```

{{< figure src="img/firewall-rule.png" caption="After creating the rule, make sure to tag your VM with with it under its settings" >}}


That's it for now! You now have a basic environment for frontend development in the cloud. You can take this a step further by extracting this code into a Dockerfile for an easy containerized setup on any cloud. 
