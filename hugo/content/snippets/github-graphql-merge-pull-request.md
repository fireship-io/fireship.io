---
title: Merge a Pull Request with the GitHub GraphQL API
lastmod: 2020-03-21T12:36:06-07:00
publishdate: 2020-03-21T12:36:06-07:00
author: Jeff Delaney
draft: false
description: How to retrieve and merge Pull Requests programmatically with the GitHub GraphQL API. 
tags: 
    - github
    - graphql
    - node

type: lessons
youtube: 
github: https://github.com/fireship-io/git-sticker
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3
---

I recently gave away a sticker to every person who submitted a pull request to this [repo](https://github.com/fireship-io/git-sticker). Problem is... over 600 people submitted PRs and it would take days to review and merge them manually. Luckily, GitHub has an awesome [GraphQL API](https://developer.github.com/v4/) that allows us to handle the process in a matter of minutes with a simple node script. 

The following snippet demonstrates how to retrieve and merge Pull Requests programmatically with the GitHub GraphQL API.

Note: You must [create a Personal Access Token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) on GitHub to use the API. 

Before getting started in the code, it's often a good idea to explore the API in a client like Insomnia or PostMan. 

{{< figure src="/img/snippets/graphql-insomnia.png" caption="Using Insomnia client to explore the Github GraphQL API" >}}

## Pull Requests Query

Our first goal is to retrieve information about a batch pull requests using a GraphQL query. The [graphql-request](https://github.com/prisma-labs/graphql-request) library will help simplify the process. 

{{< file "terminal" "command line" >}}
```text
npm install graphql-request
```

### Query Pull Requests

First, we set a token in the authorization header to authenticate our requests with Github. We can then point to a username & repo to request information about it, like all the open pull requests. 

{{< file "js" "index.js" >}}
```javascript
const { GraphQLClient } = require('graphql-request');

const token = process.env.GITHUB_GQL_TOKEN;

async function main() {
  console.log(token);
  const endpoint = 'https://api.github.com/graphql';

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${token}`
    }
  });

  const query = /* GraphQL */ `
    {
      repository(owner: "fireship-io", name: "git-sticker") {
        pullRequests(first: 1, states: [OPEN]) {
          nodes {
            id
            number
            changedFiles
            deletions
            mergeable
            author {
              url
            }
          }
        }
      }
    }
  `;

  const data = await graphQLClient.request(query);

  console.log(JSON.stringify(data, undefined, 2));

}

main();
```

## Pull Request Mutation

Now that we have some info about the PRs, let's go ahead and merge one with a GraphQL mutation. The mutation requires Pull Request ID variable, which you should have from the retrieved from previous step. 

{{< file "js" "index.js" >}}
```javascript
async function main() {

 // ...omitted

 const id = 'some-pull-request-id';

 const mutation = /* GraphQL */ `
      mutation mergePullRequest($input: MergePullRequestInput!) {
        mergePullRequest(input: $input) {
          pullRequest {
            merged
            mergedAt
            state
            url
          }
        }
      }
    `;

    const variables = {
      input: {
        pullRequestId: id
      }
    };

    const { mergePullRequest } = await graphQLClient.request(mutation, variables);

    console.log(`merged ${mergePullRequest.pullRequest.url}`);
}

main();
```

Merged! Part of code in this snippet was used to merge 600+ pull requests in just a few seconds.