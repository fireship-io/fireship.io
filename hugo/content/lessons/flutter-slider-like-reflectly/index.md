---
title: Flutter Firestore Animated SlideShow
lastmod: 2019-03-20T10:18:59-07:00
publishdate: 2019-03-20T10:18:59-07:00
author: Jeff Delaney
draft: false
description: Build an animated and filterable slideshow with FlutterFire - inspired by the Reflectly app. 
tags: 
    - flutter
    - firestore
    - firebase
    - animation

youtube: 8PfiY0U_PBI
github: https://github.com/codediodeio/flutter-firestore-animated-slideshow
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

One of the best examples of a well-designed UI in Flutter is [Reflectly](https://reflectly.app/) - an AI-powered journal app for iOS and Android. The following lesson will show you how to build an animated slideshow carousel inspired by the work of Reflectly. In addition, we will wire it up to Firestore to make it filterable and able to scale to an infinite number of pages.

{{< vimeo 325570527 >}}

## PageView Widget Intro

The most import widget in this lesson is the [PageView](https://docs.flutter.io/flutter/widgets/PageView-class.html), which makes it possible to easily build sliding pages. It is a great tool when you have a linear flow of content because it provides the gesture-detection and animation behavior out of the box. 

Optionally, you can control the state of the PageView slider with a `PageController` to navigate to a specific index in the children list. 

{{< vimeo 325572628 >}}

### Basic Example

Run the code below in your Flutter project to build a basic PageView slideshow. 

{{< file "dart" "main.dart" >}}
{{< highlight dart >}}
class MyApp extends StatelessWidget {

  final PageController ctrl = PageController();

  @override
  Widget build(BuildContext context) {

    return MaterialApp(
      home: Scaffold(
        body: PageView(
          // scrollDirection: Axis.vertical,
          controller: ctrl,
          children: [
              Container(color: Colors.green),
              Container(color: Colors.blue),
              Container(color: Colors.orange),
              Container(color: Colors.red)
          ]
        )

      ), 
    );
  }
}
{{< /highlight >}}

## Firestore PageView Builder

Now we're ready to take things to the next level. We will create a custom animation for the active page and use Firestore create and filter pages dynamically from the backend database. 

### Initial Setup

Our feature will start with a *StatefulWidget*. There are two main events that should trigger a rebuild of the widgets. (1) The user swipes to a different page, and (2) the Firestore query changes. Both of these event sources will be setup during the *initState* lifecycle hook. 

{{< file "dart" "main.dart" >}}
{{< highlight dart >}}
class FirestoreSlideshow extends StatefulWidget {
  createState() => FirestoreSlideshowState();
}

class FirestoreSlideshowState extends State<FirestoreSlideshow> {

  final PageController ctrl = PageController(viewportFraction: 0.8);

  final Firestore db = Firestore.instance;
  Stream slides;

  
  String activeTag = 'favorites';

  // Keep track of current page to avoid unnecessary renders
  int currentPage = 0;


  @override
  void initState() {
    _queryDb();
    
    // Set state when page changes
    ctrl.addListener(() { 
      int next = ctrl.page.round();

      if(currentPage != next) { 
        setState(() {
          currentPage = next;
        });
      } 
    });

    @override
    Widget build(BuildContext context) { 
        // TODO
    }


    // Query Firestore
    _queryDb({ String tag ='favorites' }) {
        // TODO
    }


    // Builder Functions

    _buildStoryPage(Map data, bool active) {
        // TODO
    }


    _buildTagPage() {
        // TODO
    }

    _buildButton(tag) {
        // TODO
    }
  
}
{{< /highlight >}}

## Firestore Query

### Data Model

{{< figure src="img/slideshow-data-model.png" caption="Firestore contains the title, background image, and tags array for each page" >}}

### Query the Database by Tag

We can query the database for all stories that contain a specific tag using Firestore's [array contains](https://firebase.google.com/docs/firestore/query-data/queries#array_membership) query type. In addition, it is useful to map the document snapshots to their raw data payload at this point to keep the main widget build method free of business logic. Lastly, we update the *activeTag* on the widget to style the corresponding button with a different color when that filter is applied. 

{{< file "dart" "main.dart" >}}
{{< highlight dart >}}
  Stream _queryDb({ String tag ='favorites' }) {
    
    // Make a Query
    Query query = db.collection('stories').where('tags', arrayContains: tag);

    // Map the documents to the data payload
    slides = query.snapshots().map((list) => list.documents.map((doc) => doc.data));

    // Update the active tag
    setState(() {
      activeTag = tag;
    });

  }
{{< /highlight >}}


## UI Design

### PageView Builder

In the widget's build method we first start by setting up a `StreamBuilder` so the widget reacts to data changes in Firestore. Next, we use the [PageView.builder](https://docs.flutter.io/flutter/widgets/PageView/PageView.builder.html) constructor, which allows us to build our UI on the fly and scale up to infinitely large collections. If the current index is zero, build the tag page, otherwise build the main story/card page. 

{{< file "dart" "main.dart" >}}
{{< highlight dart >}}
@override
  Widget build(BuildContext context) { 
      return StreamBuilder(
          stream: slides,
          initialData: [],
          builder: (context, AsyncSnapshot snap) { 

            List slideList = snap.data.toList();

            return PageView.builder(
          
              controller: ctrl,
              itemCount: slideList.length + 1,
              itemBuilder: (context, int currentIdx) {
              

              if (currentIdx == 0) {
                return _buildTagPage();
              } else if (slideList.length >= currentIdx) {
                // Active page
                bool active = currentIdx == currentPage;
                return _buildStoryPage(slideList[currentIdx - 1], active);
              }
            }
          );
        }
    );
  }
{{< /highlight >}}

### Animating with an AnimatedContainer

In this section, we use the [AnimatedContainer](https://docs.flutter.io/flutter/widgets/AnimatedContainer-class.html) Widget to give the active page more height and a stronger box shadow when it's active in the PageView. An AnimatedContainer is just like a regular Container, expect it requires a *duration* and *curve*. When its attributes change, Flutter will automatically perform a linear interpolation between the values with a transition animation. 

{{< file "dart" "main.dart" >}}
{{< highlight dart >}}
  _buildStoryPage(Map data, bool active) {
     // Animated Properties
    final double blur = active ? 30 : 0;
    final double offset = active ? 20 : 0;
    final double top = active ? 100 : 200;


    return AnimatedContainer(
      duration: Duration(milliseconds: 500),
      curve: Curves.easeOutQuint,
      margin: EdgeInsets.only(top: top, bottom: 50, right: 30),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),

        image: DecorationImage(
            fit: BoxFit.cover,
            image: NetworkImage(data['img']),
        ),

        boxShadow: [BoxShadow(color: Colors.black87, blurRadius: blur, offset: Offset(offset, offset))]
      ),

    );
  }
{{< /highlight >}}


### Filterable Firestore List

The final step is to create a page with the tag filter buttons. This section is simply lays out a *Column* with several buttons that call `_queryDb` when pressed to refine the database query on the backend. 

{{< file "dart" "main.dart" >}}
{{< highlight dart >}}
  _buildTagPage() {
    return Container(child: 
      Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.start,
    
        children: [
          Text('Your Stories', style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold),),
          Text('FILTER', style: TextStyle( color: Colors.black26 )),
          _buildButton('favorites'),
          _buildButton('happy'),
          _buildButton('sad')
        ],
      )
    );
  }

  _buildButton(tag) {
    Color color = tag == activeTag ? Colors.purple : Colors.white;
    return FlatButton(color: color, child: Text('#$tag'), onPressed: () => _queryDb(tag: tag));
  }
{{< /highlight >}}
