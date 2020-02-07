---
title: SendGrid Flutter
lastmod: 2019-07-05T10:43:06-07:00
publishdate: 2019-07-05T10:43:06-07:00
author: Jeff Delaney
draft: false
description: Send transactional email from Flutter with SendGrid
type: lessons
# pro: true
tags: 
    - flutter
    - ios
    - android
    - sendgrid

vimeo: 346869096
github: https://github.com/fireship-io/196-sendgrid-email-cloud-functions
# youtube: 
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3

# chapters:

---

{{< box emoji="👀" >}}
This tutorial is an extension of the [SendGrid Transactional Email Guide](/lessons/sendgrid-transactional-email-guide/). You must have the Cloud Functions deployed to start sending email from your frontend app. 
{{< /box >}}


## Initial Setup

To support both iOS and Android, you will need to follow the [Firebase installation guide](/snippets/install-flutterfire/) and have the *cloud_functions* and *auth* plugins from [FlutterFire](https://github.com/flutter/plugins/blob/master/FlutterFire.md) installed.

{{< file "flutter" "pubspec.yaml" >}}
{{< highlight yaml >}}
dependencies:
  flutter:
    sdk: flutter

  firebase_core: 0.4.0
  firebase_auth: 0.11.1+7
  cloud_functions: 0.4.0+2
{{< /highlight >}}

## Transactional Email Widget

The widget below creates a new user with email/pass auth and provides a button to send a transactional email (via callable functions) from the app. 

{{< file "dart" "main.dart" >}}
{{< highlight dart >}}
class TransactionalEmail extends StatefulWidget {
  @override
  createState() => _TransactionalEmailState();
}

class _TransactionalEmailState extends State<TransactionalEmail> {

  final HttpsCallable callable = CloudFunctions.instance.getHttpsCallable(
    functionName: 'genericEmail',
  );

  final FirebaseAuth auth = FirebaseAuth.instance;

  FirebaseUser user;

  String emailAddress = 'CHANGE_ME@example.com';

  @override
    initState() {
      super.initState();
      auth.onAuthStateChanged.listen((u) { 
        setState(() => user = u);
      });
  }

  sendEmail() {
    return callable.call({
      'text': 'Sending email with Flutter and SendGrid is fun!', 
      'subject': 'Email from Flutter'
    }).then((res) => print(res.data));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Send Email with SendGrid and Flutter'),),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            if (user != null) ...[
              Text('$user'),
              FlatButton(child: Text('SignOut'), onPressed: auth.signOut),
              FlatButton(child: Text('Send Email with Callable Function'), onPressed: sendEmail)
            ]

            else ...[
              FlatButton(child: Text('Login'), onPressed: () => auth.createUserWithEmailAndPassword(email: emailAddress, password: 'demoPass23'))
            ]
          ],
        ),
      ),
    );
  }
}
{{< /highlight >}}