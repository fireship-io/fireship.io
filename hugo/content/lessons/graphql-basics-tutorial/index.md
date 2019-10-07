---
title: Graphql Basics Tutorial
lastmod: 2019-10-07T09:38:50-07:00
publishdate: 2019-10-07T09:38:50-07:00
author: Jeff Delaney
draft: false
description: Learn the basics of GraphQL and Apollo by interacting with the SpaceX API
tags: 
    - graphql
    - apollo
    - typescript
    - angular

youtube: 
github: https://github.com/arjunyel/angular-spacex-graphql-codegen
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

🙏 Special thanks to [Arjun](https://github.com/arjunyel) for producing the code for this demo!

[GraphQL](https://graphql.org) as been one of the fastest growing web technologies over the past few years. 

The following lesson will cover the basics of GraphQL, then build an Angular app interact with public [SpaceX API](https://api.spacex.land/graphql/)


## How to Query a GraphQL API

GraphQL is a strongly-typed query language designed for APIs. As a consumer, you write queries that describe the data you wish to retrieve from the API. Unlike REST, there is a single entrypoint to the API. The following examples include actual queries you can run against the SpaceX GraphQL API.

The backend developer will 



### Query a List


{{< file "graphql" "foo.graphql" >}}
{{< highlight gql >}}
type Query {
  me: User
}

type User {
  id: ID
  name: String
}
{{< /highlight >}}

### Query an Object

