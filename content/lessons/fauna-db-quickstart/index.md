---
title: FaunaDB Basics
lastmod: 2020-10-11T07:14:44-07:00
publishdate: 2020-10-11T07:14:44-07:00
author: Jeff Delaney
draft: false
description: Learn the fundamentals of FaunaDB by modeling a twitter-like social graph. 
tags: 
    - fauna
    - javascript

youtube: 2CipVwISumA
github: https://github.com/fireship-io/faunadb-basics
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

[FaunaDB](https://fauna.com/) is a next-generation cloud database that combines the simplicity of NoSQL, without sacrificing the ability to model complex relationships. It's completely serverless, fast, ACID-compliant, and has a generous free tier for small apps - basically everything you could possibly want in a fully-managed database. 

The following lesson demonstrates how to model a basic twitter-inspired social graph with FaunaDB and access it on the web with Node.js. It will introduce you to [Fauna Query Language](https://docs.fauna.com/fauna/current/api/fql/cheat_sheet) (FQL) and common patterns for reading and writing to the database. 

## Initial Setup

Start by creating a node project, then install the [FaunaDB JS](https://github.com/fauna/faunadb-js) package and [Express](https://expressjs.com/). 

{{< file "terminal" "command line" >}}
```bash
npm init -y

npm install faunadb express
```

### Initialize FaunaDB

{{< figure src="img/fauna-key.png" caption="Create a server key from the Fauna security tab" >}}

Initialize the client with your server key, then import the FQL functions required for this demo. 

{{< file "js" "src/index.js" >}}
```javascript
const faunadb = require('faunadb');
const client = new faunadb.Client({ secret: 'YOUR-KEY' })

// FQL functions
const {
    Ref,
    Paginate,
    Get,
    Match,
    Select,
    Index,
    Create,
    Collection,
    Join,
    Call,
    Function: Fn,
} = faunadb.query;

```

### Initialize Express

We'll use Express to serve the API.

{{< file "js" "src/index.js" >}}
```javascript
const app = require('express')();

app.listen(5000, () => console.log('API on http://localhost:5000'))
```

At this point, I would recommend using an API client like [Insomnia](https://insomnia.rest/) to make requests to your API on http://localhost:5000. 

### Database Structure

The database contains three collections - `users`, `tweets`, and `relationships`. Create these collections from the Fauna dashboard. 

{{< figure src="img/fauna-collections.png" caption="" >}}

## Users and Tweets

In the following section, we will create a variety of API endpoints for reading and writing tweets to Fauna. A user *has many* tweets, a tweet *belongs to* a user. 

### Create a Tweet

First, go to the Fauna dashboard, and create a document with the name of `fireship_dev`. Our goal is to associate many tweets to this user account. 

Next, create an index to search for a user based on the username. 

{{< figure src="img/fauna-index.png" caption="" >}}

A one-to-many relationship can be established by retrieving the user document `Ref`, then using it as the data with the `Create` function. 

{{< file "js" "src/index.js" >}}
```javascript
app.post('/tweet', async (req, res) => {

    const data = {
        user: Select('ref', Get(Match(Index('users_by_name'), 'fireship_dev'))),
        text: 'Hello world!'
    }

    const doc = await client.query(
        Create(
            Collection('tweets'),
            { data }
        )
    )

    res.send(doc)
});

```

### Read a Tweet by ID

Reading a document by its ID does not require an index. Use `Get` to read a single document by pointing to its collection and reference ID. 

{{< file "js" "src/index.js" >}}
```javascript
app.get('/tweet/:id', async (req, res) => {

    const doc = await client.query(
        Get(
            Ref(
                Collection('tweets'),
                req.params.id
            )
        )
    )

    res.send(doc)

});
```

### Query a User's Tweets

Reading multiple tweet documents by the user attribute requires an index. Create an index named `tweets_by_user` with a search term of `user`. 

The `Paginate` function will return all documents that match the query.  

{{< file "js" "src/index.js" >}}
```javascript
app.get('/tweet', async (req, res) => {

    const docs = await client.query(
        Paginate(
            Match(
                Index('tweets_by_user'), 
                Select('ref', Get(Match(Index('users_by_name'), 'fireship_dev')))
            )
        )
    )

    res.send(docs)
});
```

## Fauna Functions

The code presented above duplicates the following line of FQL several times: 

```javascript
Select('ref', Get(Match(Index('users_by_name'), 'fireship_dev')))
```

Fauna [Functions](https://docs.fauna.com/fauna/current/api/fql/functions) provide a way to extract this logic to the cloud to reduce duplication and improve maintainability. 

### Create a Function

Extract the duplicated code to a function from the Fauna dashboard. The function accepts the username string as an argument and returns the full user document reference. 

{{< figure src="img/fauna-function.png" caption="" >}}

### Call a Function

Use `Call` to execute this function in a query. For example, we can refactor the previous example like so: 

{{< file "js" "src/index.js" >}}
```javascript
const {
    Call,
    Function: Fn,
} = faunadb.query;

app.get('/tweet', async (req, res) => {

    const docs = await client.query(
        Paginate(
            Match(
                Index('tweets_by_user'), 
                Call(Fn("getUser"), 'fireship_dev')
            )
        )
    )

    res.send(docs)
});
```

## User-to-User Relationships

The following section models a social graph where users can follow other users, then query a feed of their tweets.

### Create a Relationship

A relationship document contains two user references - the follower and followee. 

{{< file "js" "src/index.js" >}}
```javascript
app.post('/relationship', async (req, res) => {


    const data = {
        follower: Call(Fn("getUser"), 'bob'),
        followee: Call(Fn("getUser"), 'fireship_dev')
    }
    const doc = await client.query(
        Create(
            Collection('relationships'),
            { data }
        )
    )

    res.send(doc)
});
```

### Query a Feed of Tweets

After establishing a relationship, you likely want to query tweets from followed users - this will require a `Join`. 

Create an index named `followees_by_follower` with a search term of `followee` and a value of `follower`. 

The `Paginate` function will return all followed users, then Join will match the user references to the `tweets_by_user` index. 

{{< file "js" "src/index.js" >}}
```javascript
app.get('/feed', async (req, res) => {
    const docs = await client.query(
        Paginate(
            Join(
                Match(
                    Index('followees_by_follower'),
                    Call(Fn("getUser"), 'bob')
                ),
                Index('tweets_by_user'),
            )
        )
    )

    res.send(docs)
});
```
