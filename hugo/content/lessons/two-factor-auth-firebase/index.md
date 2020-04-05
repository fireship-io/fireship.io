---
title: 2FA with Firebase Authentication
lastmod: 2020-04-04T13:49:27-07:00
publishdate: 2020-04-04T13:49:27-07:00
author: Jeff Delaney
draft: false
description: How to perform two-factor authentication (2FA) with Firebase
tags: 
    - firebase
    - authentication
    - pro

pro: true
# youtube: 
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

How do you handle two-factor (2FA), or multifactor (MFA) authentication in Firebase? Until recently, the answer was you can't.  Thankfully, in 2020 we setup multifactor auth flows for Firebase with Google Cloud [Identity Platform](https://cloud.google.com/identity-platform). The tutorial demonstrates the following user auth flow:

1. sign up with email/password and send a verification email to the user
2. register phone number(s) for 2FA
2. login with email/password, sending SMS text message to the user. 
3. verify the code to login

## Get Started

{{< figure src="img/enable-identity-platform.png" caption="Enable Identity Platform on Google cloud" >}}

If you have an existing Firebase project, it should automatically sync your existing auth methods. Also, you must be on a paid billing plan to use this service (the Spark Plan will not cut it). 

## Captcha Verification

## Part 1: Sign Up and Verify Email

A user must verify their email before setting up 2FA. Note: If you use Google (or any social provider), the email should be verified automatically. 

### Basic Email Password Signup

### Email Verification

## Part 2: Register a Secondary Factor (Phone)

In this section, we register and verify a second auth factor for user. T

## Part 3: Sign In with SMS Verification

Now that we have a phone number registered, we can login. 