---
title: Dashboard
date: 2018-11-15T08:36:36-07:00
draft: false
---

<google-login show-signout="true">
    <button slot="signin" class="btn">
        {{< partial "svg/google.svg" >}} Login Now
    </button>
    <button class="btn btn-orange btn-sm" slot="signout">Signout</button>
</google-login>




{{< partial "pricing" >}}

<hr>
<div class="payment-card">
    <payment-form></payment-form>
</div>

<user-charges></user-charges>

<hr> 
<user-details></user-details>

<hr> 
<user-sources></user-sources>