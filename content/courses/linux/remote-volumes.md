---
title: Mount a Volume
description: How to attach block storage to your VPS
weight: 39
lastmod: 2024-06-20T11:11:30-09:00
draft: false
vimeo: 974264638
emoji: 💽
video_length: 1:44
---

## Mount Block Storage

```bash
lsblk
mkfs.ext4 /dev/vdb
mkdir -p /mnt/blockstorage/pb_data
mount /dev/vdb /mnt/blockstorage
chmod -R 755 /mnt/blockstorage/pb_data
echo "/dev/vdb /mnt/blockstorage ext4 defaults,nofail 0 0" | sudo tee -a /etc/fstab
nano /etc/systemd/system/pocketbase.service

## Update this line
ExecStart=/root/apps/guestbook/pocketbase serve --http="127.0.0.1:8090" --dir="/mnt/blockstorage/pb_data"

sudo systemctl daemon-reload
sudo systemctl restart pocketbase
sudo systemctl restart nextjs
```