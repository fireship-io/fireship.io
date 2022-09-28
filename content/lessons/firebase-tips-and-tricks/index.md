---
title: Top 100 Firebase Tips and Tricks
lastmod: 2019-10-09T20:31:24-07:00
publishdate: 2019-10-09T20:31:24-07:00
author: Jeff Delaney
draft: false
description: A collection of tips, tricks, and common mistakes you should know about when working with Firebase. 
tags: 
    - firebase

youtube: iWEgpdVSZyg
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

The list below outlines the Firebase tips presented in the video. 

## Get Started

1. Create a two Firebase Projects - one for development and another for live production data
2. Link Google Analytics
3. Limit permissions for employees, follow the [Principle of Least Privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) 
4. Update contact info for GDPR
5. Add a project and don't worry about exposing your credentials in frontend code
6. Upgrade to Blaze, then set a budget on GCP
7. Generate detailed reports for billing
8. Install the Firebase Tools CLI and GCloud. You should be able to run `firebase` and `gcloud` from the command line. 

## Hosting and Distribution

9. Use App Distribution to bypass Google Play and Apple Test Flight
10. Use NPM Scripts to build/deploy your app
11. Use `--project` flag to avoid deploying to the wrong project
12. Use the the cool new *web.app* domain
13. Add additional sites with multisite hosting
14. Rewrite routes to Cloud Function or Cloud Run 
15. Rewrite routes Dynamic Links
16. Set custom CORS Headers
17. Set custom Cache Headers
18. Add CI/CD with Cloud Build

## Frontend Setup

19. RTDB vs Firebase
20. Stop worrying about pricing
21. Backup your Firestore data
22. Start the Database in locked mode
23. Run queries from the console
24. Know the right JS import syntax
25. Import services from firebase/app
26. Defer script tags that contain the Firebase SDK.
27. Angular App? Use AngularFire
28. React App? Use ReactFire
29. RxJS? Use RxFire
30. Find additional projects from the FirebaseExtended Github Org. 
31. Use Performance Monitoring
32. Use Crashlytics
33. Use Analytics


## Auth + Firestore Techniques

34. Get the current user as a Promise OR add a realtime listener. 
35. Learn async programming
36. Handle auth errors
37. Implement lazy auth by linking auth methods
38. Create your own custom email action handlers
39. One-To-One relationships with a DocID
40. Use the `merge: true` for a non-destructive Firestore `set`
41. OneToMany relationships with a sub-collection
42. Query collections with a common name using `collectionGroup`
43. Many-To-Many with a UID Map
44. Use duplication to increase performance and reduce costs
45. Query Map values with dot notation 
46. Query data once OR with a realtime listener
47. Listen to specific doc changes
48. Sync browser tabs for offline persistence
49. Use emojis in your code
50. Wildcard string queries with `~`
51. Create indicies by viewing the Firestore error logs
52. Write to lists with array union & remove
53. Query lists with array-contains
54. Pipeline concurrent single doc read requests
55. Use `serverTimestamp` to update times 
56. Use `increment` to update counters
57. Use the Distributed Counter extension
58. Run atomic writes with `batch`
59. Don't be afraid to integrate an SQL or Fulltext Search database

## Rules

60. Always use rules
61. Play with the Simulator
62. Test with the Emulator
63. Make your rules fine-grained based on read/write types
64. request vs resource
65. Use `get` to read other database locations
66. Simplify rules with functions

## Storage

67. Create multiple buckets, use coldline for infrequently accessed data.
68. Save the download URL and file location to Firestore
69. Make a references with refFromURL
70. List all files in a directory
71. Calculate progress with `bytesTransferred / totalBytes`
72. Upload concurrently
73. Assign metadata
74. Use the Resizer extension

##  Admin

75. Create a Admin script for Node.js
76. Keep your Service Account private via gitignore or an environment variable
77. Seed the Database with Faker.js
78. Use the REST APIs 
79. Integrate googleapis for better REST code.

## Cloud Functions

80. Use TypeScript
81. Minimize dependencies
82. Use Global Variables
83. Write idempotent code
84. Adjust `runWith` Settings for more time and memory
85. Avoid infinite loops
86. Use `isEqual` to break infinite loops
87. Always return a Promise
88. Use PubSub functions for internal services
89. Use callable functions for user auth
90. Delete Firestore collections in batches 
91. Write small, pure JS functions
92. Use Third-Party APIs
93. Deploy single functions
94. Test functions in the shell
95. Customize logging with Stackdriver

## Analytics

96. Record events and user properties
97. Create audiences
98. Customize the UX with remote config
99. Send smart notifications
100. Sprinkle in some Machine Learning

And don't forget to have fun!