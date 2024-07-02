---
title: Nginx
description: How to configure Nginx on your VPS
weight: 36
lastmod: 2024-06-20T11:11:30-09:00
draft: false
vimeo: 974265036
emoji: 🚅
video_length: 3:25
---

## Modify the Nginx Config

```bash
nano /etc/nginx/sites-available/guestbook
ln -s /etc/nginx/sites-available/guestbook /etc/nginx/sites-enabled/

rm /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx
```


## Nginx Config

The Nginx config will redirect all HTTP traffic to HTTPS. It also serves as a reverse proxy to route traffic to either the Next.js frontend or Pocketbase Admin dashboard. 

Example of full Nginx config: 

```bash
server {
    listen 80;
    server_name linux.fireship.app;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name linux.fireship.app;

    # SSL configuration using Cloudflare certificates
    ssl_certificate /etc/ssl/cert.pem;
    ssl_certificate_key /etc/ssl/key.pem;

    # SSL settings (recommended for security)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;

    # Next.js application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # PocketBase API and Admin UI
    location /pb/ {
        rewrite ^/pb(/.*)$ $1 break;
        proxy_pass http://localhost:8090;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
## Bonus Video 

<div class="vid-center">
{{< youtube JKxlsvZXG7c >}}
</div>
