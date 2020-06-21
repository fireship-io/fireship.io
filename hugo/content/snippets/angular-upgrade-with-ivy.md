---
title: How to Upgrade Angular Packages
lastmod: 2019-03-13T08:01:59-07:00
publishdate: 2019-03-13T08:01:59-07:00
author: Jeff Delaney
draft: false
description: How to upgrade to the latest packages in Angular
tags: 
    - angular

# type: lesson
# youtube: 
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

versions: 
    - "@angular/core": 8.0
---

The following guide will show you how to update packages in an Angular project and enable the Ivy compiler. 


## Auto Upgrade

You may be able to update your project using the `ng update` command. 

{{< file "terminal" "command line" >}}
{{< highlight text >}}
npm i -g @angular/cli@latest
ng update
{{< /highlight >}}

If you would like to install bleeding-edge Angular packages, use the manual upgrade commands below. 


## Manual Upgrade

You can manually upgrade Angular's most common packages using the commands below. Keep in mind, you many need to add additional packages based on what exists in your *package.json*. The commands below use the `@next` tag, which will upgrade to the latest beta or rc versions of Angular. Change this tag to `@latest` for the latest stable version. 


{{< file "terminal" "command line" >}}
{{< highlight text >}}
npm i -g @angular/cli@next

# depencencies
npm i @angular/{common,compiler,forms,platform-browser,platform-browser-dynamic,platform-server,router}@next 
npm i rxjs core-js zone.js


# devDependencies
npm i @angular-devkit/build-angular@next @angular/{compiler-cli,cli,language-service}@next -D
{{< /highlight >}}


## Enabling Ivy

Refer to the [official Angular Ivy](https://next.angular.io/guide/ivy) guide if you run into issues. 

Update your root tsconfig. 

{{< file "typescript" "tsconfig.json" >}}
{{< highlight json >}}
{
  "compilerOptions": {
    "module": "esnext",
    // ...
  },
  "angularCompilerOptions": {
    "enableIvy": true,
    "allowEmptyCodegenFiles": true
  }
}
{{< /highlight >}}

Update the angular CLI config. 

{{< file "angular" "angular.json" >}}
{{< highlight json >}}
{
  "projects": {
    "your-project": {
      "architect": {
        "build": {
          "options": {
            ...
            "aot": true,
          }
        }
      }
    }
  }
}
{{< /highlight >}}

Add this script to your package.json. 

{{< file "npm" "package.json" >}}
{{< highlight json >}}
{
  "scripts": {
    ...
    "postinstall": "ivy-ngcc"
  }
}
{{< /highlight >}}

Lastly, run `npm install` to run this script. When you serve or build your app it should now be in ivy mode. You should see a noticeable decrease in the total bundle size. 