---
title: Dashboard
date: 2018-11-15T08:36:36-07:00
draft: false
description: Manage your Fireship Account
hide_feed: true
---

<a href="/pro">PRO</a>

<!-- {{< partial "pricing" >}} -->

{{< partial "dashboard" >}}

<hr>
<div class="payment-card">
    <payment-form></payment-form>
</div>


<allow-if level="user">
    <span>Stuff for users</span>
</allow-if>

<allow-if level="pro">
    <span>Stuff for pro members</span>
    <button slot="paywall">Upgrade<button/>
</allow-if>