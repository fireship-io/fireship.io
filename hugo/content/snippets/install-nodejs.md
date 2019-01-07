---
title: Install NodeJS
publishdate: 2018-12-11T09:35:09-07:00
lastmod: 2018-12-11T09:35:09-07:00
draft: false
author: Jeff Delaney
description: How to Install NodeJS
tags: 
    - node
---

It is likely that you already have [NodeJS](https://nodejs.org/en/) installed on your machine. Try running `node -v` from the command line. If that does not work or the version is older than `8.15`, follow the install instructions below.


## Node Version Manager NVM

[Node Version Manager](https://github.com/creationix/nvm) NVM makes is easy to switch between Node versions in your local environment. I highly recommend using it over the native install on your system. 

### Mac and Linux

Simply run the install script from the command line. 

{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
{{< /highlight >}}


Restart your terminal. You should now be able to easily install and manage Node versions.

{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
nvm install 10

nvm use 10
{{< /highlight >}}


### Windows

NVM is not available on Windows, but there is a solid alternative with [nvm-windows](https://github.com/coreybutler/nvm-windows). It provides an installer than you can download from the repo. Once installed you will have access commands similar to those above. 


