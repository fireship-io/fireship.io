---
title: Final Checklist
description: Checklist of considerations for VPS deployment
weight: 40
lastmod: 2024-06-20T11:11:30-09:00
draft: false
vimeo: 974264202
emoji: 🚀
video_length: 3:25
---


- DDOS attack
- Caching. CDN. Database
- Scaling Up. Increase CPU/RAM of VPS
- Sending email. 
- Deploying with Docker
- Coolify
- Logging/Monoitoring
- Backups. Disaster recovery plan. Ansible
- Deploying with SST




server {
    # ...

    location / {
        # ...
        deny 192.168.1.100;
        deny 10.0.0.0/8;
        allow all;
    }
}



