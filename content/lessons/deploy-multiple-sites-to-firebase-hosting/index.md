---
title: Deploy Multiple Sites to Firebase Hosting
lastmod: 2018-08-29T17:35:41-07:00
publishdate: 2018-08-29T17:35:41-07:00
author: Jeff Delaney
draft: false
description: Learn how manage multiple sites from a single Firebase project
tags: 
    - firebase
    - i18n

youtube: NrkFBmBFA6k
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

 
Firebase hosting recently announced support for [multiple hosting targets](https://firebase.googleblog.com/2018/08/one-project-multiple-sites-plus-boost.html) within a single project. I am thrilled to see this feature because it is such a common requirement for real world apps. For example, you might have two separate apps - one for customers, one for admin employees - both of which share the same database and functions. In the past, we would have to get clever with deployment by either sharing the same URL or juggling multiple projects. 

The obvious benefit here is resource sharing across multiple domains with common use cases including:

- Separate admin/customer apps
- Translated i18n apps
- Hosting for staging and/or edge builds


{{< figure src="img/multisite-demo.gif" caption="Demo of multiple sites hosted by single Firebase Project" >}}

In the following lesson, you will learn how to setup mulitsite hosting in Firebase from scratch.

<p class="tip">You must be on the **Blaze** pay-as-you-go plan to deploy multiple sites to Firebase.</p>

## Example: i18n Builds

The example for this tutorial is a project using the Angular CLI's internationalization tools that gives you multiple builds for the languages you've translated. Apps using i18n will have a dist folder that looks like this: 

{{< figure src="img/dist-i18n.png" caption="Multiple languages in dist translated in Angular" >}}

Essentially, we have three different apps or websites (English, French, and Spanish) that each need their own hosting resources and unique URL. You might want to deploy each translated site to  an appropriate sub-domain. 

- en.example.com
- fr.example.com
- es.example.com


## Multisite Hosting and Deployment Step-by-Step

<p class="tip">Also reference the official [Firebase multisite documentation](https://firebase.google.com/docs/hosting/multisites)</p>

Managing multiple sites in Firebase Hosting just requires a few simiple configuration steps. 

### 1. Define your Hosted Sites

Go to the hosting tab on the Firebase console and add your sites. Each site can have its own custom domain and deployment history. 

<img class="content-image" src="/images/multisite-hosting.png" alt="Add multiple sites from firebase console" /> 

{{< figure src="img/multisite-hosting.png" caption="Add multiple sites from the Firebase Console" >}}

### 2. Update firebase-tools to 4.2 and Initialize Hosting

You need Firebase Tools v4.2 or later for multisite hosting. 

```shell
npm i -g firebase-tools@latest
firebase -v

firebase init hosting
```

### 3. Update the Hosting Config

Now we just need to update the `firebase.json` hosting config. Each site has a target that points to the public deployable code in the *dist* folder. 

```js
{
  "hosting": [ {
      "target": "english", 
      "public": "dist/myapp",
      "rewrites": [...] 
    },
    {
      "target": "french", 
      "public": "dist/fr-myapp",
      "rewrites": [...] 
    },
    {
      "target": "spanish", 
      "public": "dist/es-myapp",
      "rewrites": [...] 
    }
  ]
}
```

### 4. Define Hosting Targets

We need to associate the sites with a local target so Firebase knows which code to deploy where. We run the following command for each site: `firebase target:apply hosting <target-name> <resource-name>` where the target is just a unique name you choose, and resource-name is the site from step 1. 

```shell
firebase target:apply hosting  english  myproject
firebase target:apply hosting  french   fr-myproject
firebase target:apply hosting  spanish  es-myproject
```



### 5. Deployment

Our configuration is complete. We can deploy all sites together with:

```shell
firebase deploy --only hosting
```

Or deploy a single site based on the target name:  

```shell
firebase serve --only hosting:french
```


### Optional: Connect a Custom Domain

If you own your own domain name, you can setup subdomains, like `es.example.com` to route traffic to the Spanish build at the DNS level. 

{{< figure src="img/connect-domain.png" caption="Connect your own domain to multiple firebase sites" >}}


