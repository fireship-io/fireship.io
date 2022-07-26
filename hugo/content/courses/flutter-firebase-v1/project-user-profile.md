---
title: User Profile
description: Display user data on the profile screen
weight: 31
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 🐼
vimeo: 336344151
video_length: 1:43
---

## User Profile Screen

{{< file "dart" "profile.dart" >}}
```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:quizapp/services/services.dart';
import 'package:quizapp/shared/shared.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  @override
  Widget build(BuildContext context) {
    var report = Provider.of<Report>(context);
    var user = AuthService().user;

    if (user != null) {
      return Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.deepOrange,
          title: Text(user.displayName ?? 'Guest'),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Container(
                width: 100,
                height: 100,
                margin: const EdgeInsets.only(top: 50),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  image: DecorationImage(
                    image: NetworkImage(user.photoURL ??
                        'https://www.gravatar.com/avatar/placeholder'),
                  ),
                ),
              ),
              Text(user.email ?? '',
                  style: Theme.of(context).textTheme.headline6),
              const Spacer(),
              Text('${report.total}',
                  style: Theme.of(context).textTheme.headline2),
              Text('Quizzes Completed',
                  style: Theme.of(context).textTheme.subtitle2),
              const Spacer(),
              ElevatedButton(
                child: const Text('logout'),
                onPressed: () async {
                  await AuthService().signOut();
                  if (mounted) {
                    Navigator.of(context)
                        .pushNamedAndRemoveUntil('/', (route) => false);
                  }
                },
              ),
              const Spacer(),
            ],
          ),
        ),
      );
    } else {
      return const Loader();
    }
  }
}
```