---
title: Windows (and Linux) for Web Development
lastmod: 2020-04-03T13:22:42-07:00
publishdate: 2020-04-03T13:22:42-07:00
author: Jeff Delaney
draft: false
description: Setup the ultimate web development environment running Linux on Windows 10 
tags: 
    - productivity


# youtube: 
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Maximizing productivity as a web developer means choosing the right tools. 

Historically, Windows has been been the preferred OS for web developers. Most web servers run on Linux and it helps to develop on an OS the closely resembles your production environment. 

but Microsoft launched a game changer in 2020 - [Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/about). It allows us to install REAL (not emulated) linux distros (like Ubuntu) on Windows. 

## Linux on Windows

The following steps will install Linux in your Windows 10 environment. Also reference the official [WSL install guide](https://docs.microsoft.com/en-us/windows/wsl/install-win10). 

### Enable Windows-Subsystem-Linux (WSL)

Open a terminal session or PowerShell with admin privileges. 

{{< figure src="img/win-terminal-admin.png" caption="Open the command prompt in Windows 10 as an administrator" >}}

Run the command below. It will require a full reboot of your system. 

{{< file "terminal" "command line" >}}
```text
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
```

### Install a Linux Distro

Open the Microsoft store and search for *Linux*. Choose your preferred distro - personally, I prefer [Ubuntu](https://ubuntu.com/). 

{{< figure src="img/win-linux-distros.png" caption="Install your favorite Linux flavor" >}}

### Install Windows Terminal

Windows has a [new terminal app](https://www.microsoft.com/en-us/p/windows-terminal-preview/9n0dx20hk701) for working with the command line. Install it to easily switch between Linux and PowerShell. 

{{< figure src="img/win-terminal-app.png" caption="Install windows terminal and start a Linux session" >}}

You should now be able to work with the file system using the linux commands you know and love, such as:

{{< file "terminal" "command line" >}}
```bash
ls # list directory contents
mkdir testing # make directory
cd testing # move into directory
touch somefile.txt # create a file
cat somefile.txt # read a file
vi somefile.txt # edit a file with vim
```
## Customize the Command Line Prompt

### Basic Customization

Currently the command line (bash) prompt for Ubuntu is very long `jeffd23@DESKTOP-R6U97PD:/mnt/c/Users/jeffd23$`. How do we shorten the command line prompt in WSL? You can change it permanently in the `.bashrc` file by modifying the `PS1` environment variable, which is the default prompt appearance.

{{< file "terminal" "command line" >}}
```bash
code ~/.bashrc # vscode 
vi ~/.bashrc # vim
```

Below you you will find a few bash prompt examples. Add ONE of the lines to end of the file for your preferred prompt format. 

{{< file "cog" ".bashrc" >}}
```bash
export PS1="\w$ " # full working dir
export PS1="\W$ " # basename of working dir
export PS1="\u@\W $ " # username @ working dir
export PS1="[\t] \u@\h:\w\$ " # timestamp + username + host + working dir
```

Here are some variables commonly used in the prompt

- `\w` full working directory
- `\W` basename of the current working directory
- `\h` hostname
- `\u` username
- `\t` full working directory
- `\t` time 24-hour HH:MM:SS
- `\T` time 12-hour HH:MM:SS
- `\@` time 12-hour am/pm


### Zsh Z-shell

As an alternative, you can gain even more control over the Linux command line with [Oh My ZSH](https://github.com/ohmyzsh/ohmyzsh). 


```bash
sudo apt install zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

sudo apt-get install fonts-powerline
code ~/.zshrc # to customize it
```

Change the `ZSH_THEME="random"`. Your terminal sessions should be looking very fancy. Now hit `ctrl+shift+3` to cycle through different options. 


{{< file "terminal" "command line" >}}

## VSCode

With WSL installed, we need to to connect it VS Code.

### Install the Remote WSL Extension

The [Remote WSL extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl) makes it possible to use Linux (WSL) as your dev environment in VS Code. 

{{< figure src="img/win-wsl-extension.png" caption="Remote WSL extension" >}}

## Node.js

As a web developer you need Node.js.

## Vim

Completely useless. 

## Windows Terminal