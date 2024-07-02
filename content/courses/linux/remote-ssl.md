---
title: SSL
description: How to setup a free SSL certificate
weight: 35
lastmod: 2024-06-20T11:11:30-09:00
draft: false
vimeo: 974265209
emoji: 🛡️
video_length: 2:40
---

Note: This section assumes you have a domain name registered for your webapp and 


## Install CloudFlare SSL

First, obtain a free Origin Certificate from CloudFlare. You will need to transfer your DNS records to Cloudflare by [following this guide](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/). 

```
nano /etc/ssl/cert.pem
nano /etc/ssl/key.pem
```

## Alternative: Let's Encrypt

If you do not want to use CloudFlare, an alternative is to use [Certbot](https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal&tab=standard), for example: 

```
apt-get update
apt-get install certbot

certbot certonly --standalone -d example.com -d www.example.com
```

## Bonus Video

<div class="vid-center">
{{< youtube UVR9lhUGAyU >}}
</div>


