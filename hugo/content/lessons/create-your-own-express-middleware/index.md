---
title: Create your own Express Middleware
lastmod: 2021-01-20T08:43:13-07:00
publishdate: 2021-01-20T08:43:13-07:00
author: Antariksh Verma
draft: false
description: Lear how to build and use middleares in Express.js, the most popular Node.js web framework.
tags: 
    - expressjs
    - nodejs
    - javascript

github: https://github.com/antriksh123/create-your-own-express-middleware
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

What's up? Today I'll be teaching you how to create your own Express JS middleware from scratch. It's much easier than it sounds. We are going to be making a middleware I like to call logger. Don't worry, the code will be on GitHub. Although I won't put my entire Express JS project, but the main function we are going to write. So, the first thing first, we need to setup the project, so make sure you have npm and Node JS installed. Then, if you know have worked with Express JS (I am presuming you have), just create a new Express JS project.
After you have set your project, create a folder named middleware. In that folder, create a new file called logger.js

At this moment your project structure should be something like this:

- [Your Folder Name]
    - node_modules
    - middleware
        - logger.js
    - routes
        - [Route File]
    - index.js
    - package.json
    - package-lock.json

Now open logger.js and add the following code.

```
const moment = require('moment')

const logger = (req, res, next) => {
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}:${moment().format()}`)
    next()
}
``` 
I am going to exaplin this code but before that run the command, ```npm i moment```. This will install moment js which we will use to work with time. So essentially, our middleware will run and log the request url and formatted time.

In the first line we are importing moment. Then on the second line we are declaring function logger which takes 3 compulsory parameters. The first one is request, second one is the response we are getting and the third one is next. The next parameter is confusing but don't worry too much about that. What we are doing with that is just running ```next()``` which is on the 4th line. The 3rd line basically, printing the url which we get by ```req.protocol``` and ```req.get('host')```. ```req.originalUrl``` is the part of the url after the /. So if you now export this using ```module.exports = logger``` then you can access this in your router by simply importing it as a module. 

Now you have officially created your first middleware function. But we can't actually work with it yet. So if you run your server then you will see nothing being logged. To
start logging we can use a function in express that is used to initialise middleware. Some of you may know this function and have used it but for those of you who don't. ```app.use(logger)``` this is how we can get our logger to work. Here, ```app``` is just the ```express()``` function. So now run your server and voila. 

If you liked this post then react and like it, do share it so others can see it as well. If you had any doubt or want a blog post on something specific then comment down below. That was it for this time, I will see you again in another blog post.