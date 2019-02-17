---
title: Dashboard
date: 2018-11-15T08:36:36-07:00
draft: false
description: Manage your Fireship Account
---

<google-login show-signout="true">
    <button slot="signin" class="btn">
        {{< partial "svg/google.svg" >}} Login Now
    </button>
    <button class="btn btn-orange" slot="signout">Signout</button>
</google-login>


<user-plan></user-plan>

{{< partial "pricing" >}}

<hr>
<div class="payment-card">
    <payment-form></payment-form>
</div>

<subscription-manage></subscription-manage>

<user-charges></user-charges>

<hr> 
<user-details></user-details>

<hr> 
<user-sources></user-sources>

<loading-spinner></loading-spinner>