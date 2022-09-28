---
title: MySQL on Cloud Functions
lastmod: 2019-08-06T12:31:06-07:00
publishdate: 2019-08-06T12:31:06-07:00
author: Jeff Delaney
draft: false
description: Learn how to use a relational MySQL database with Firebase Cloud Functions and TypeORM
tags: 
    - sql
    - typescript
    - firebase
    - cloud-functions

youtube: sSDHdWrSqLY
github: https://github.com/fireship-io/201-cloud-functions-sql-typeorm
# disable_toc: true
# disable_qna: true

# courses
# step: 0

versions:
   typeorm: 0.2.18
   firebase-functions: 3.1.0
   typescript: 3.5.3
---

Firebase's NoSQL databases are excellent for flexibility and scale, but there are times when a traditional relational SQL database is a better tool for the job (or you may not have a choice with a legacy system). Does that mean you should ditch the Firebase platform altogether? Of course not! In fact, connecting a [Cloud SQL](https://cloud.google.com/sql/docs/) instance to Firebase Cloud Functions is one of the easiest ways to hook up a database to a web or mobile app. 

The following lesson will show you how to **connect a MySQL database to Firebase** and use [TypeORM](https://typeorm.io/) to write efficient, type-safe, readable backend code. 

## Initial Setup

Start from an empty directory in your editor. Make sure you have the [Google Cloud SDK](https://cloud.google.com/sdk/) and NodeJS installed on your system. 

### Initialize Cloud Functions

Initialize Cloud Functions and choose TypeScript as the language.

{{< file "terminal" "command line" >}}
```text
npm i -g firebase-tools

firebase init functions
```

### Create a Cloud MySQL Instance

Head over the to the Google Cloud Platform console and create a new [MySQL](https://www.mysql.com/) instance. You also have the option for Postgres, but the setup is slightly different. Make a note of the *instance connection name*. 

{{< figure src="img/cloud-sql-instance-create.png" caption="Choose MySQL for this lesson" >}}

{{< figure src="img/gcp-cloud-sql.png" caption="Cloud SQL instance running on GCP. Copy the instance connection name." >}}

### Install the Cloud SQL Proxy for Local Testing

A proxy is required connect to a Cloud SQL database locally. [Download the binary](https://cloud.google.com/sql/docs/mysql/quickstart-proxy-test#install-proxy) for your OS and save it to the root of your project.

{{< figure src="img/sql-proxy-gcp.png" caption="Download the Cloud SQL proxy binary" >}}

Run the command below with your connection name. You should see the message: **Ready for new connections**. 

{{< file "terminal" "command line" >}}
```text
./cloud_sql_proxy -instances=YOUR_CONNECTION=tcp:3306
```


### Install TypeORM with Cloud SQL

The final setup step is to install TypeORM and its dependencies in the Cloud Functions environment. 

{{< file "terminal" "command line" >}}
```text
cd functions
npm install reflect-metadata typeorm mysql 
```

Update the default TS config with the following changes for TypeORM. 

{{< file "cog" "functions/tsconfig.json" >}}
```json
{
  "compilerOptions": {
    // ...
    "strict": false,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
  },
}
```



## Connect to the MySQL Database

The code in this section connects a *development* database for local testing and a *production* database for live data. Create the database instances from the GCP dashboard. 

{{< figure src="img/cloud-sql-databases.png" caption="Create two databases, one for development and production" >}}

Connecting MySQL with TypeORM is slightly different in the Cloud Functions environment because they are ephemeral compute instances and the connection is not long-lived. In other words, the same database connection may or may not be available between requests. 

### Connection Options

The connection below is setup specifically for Google Cloud SQL. Make sure to update the username/password and connection name for your instance. 

{{< file "ts" "src/config.ts" >}}
```typescript
import { ConnectionOptions, Connection, createConnection, getConnection } from 'typeorm';
import 'reflect-metadata';

// Will be true on deployed functions
export const prod = process.env.NODE_ENV === 'production';

export const config: ConnectionOptions = {
    name: 'fun',
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root', // review
    password: 'root', // review
    database: 'development',
    synchronize: true,
    logging: false,
    entities: [
       'lib/entity/**/*.js'
    ],

    // Production Mode
    ...(prod && {
        database: 'production',
        logging: false,
        // synchronize: false,
        extra: {
            socketPath: '/cloudsql/YOUR_CONNECTION_NAME' // change
        },
    })
 }
```

### Cloud Functions Connection

The `connect` function looks for an existing database connection. If available we use it for a slight performance gain, otherwise a new connection is created. 

```typescript
export const connect = async () => {

    let connection: Connection;

    try {
        connection = getConnection(config.name)
        console.log(connection)
    } catch(err) {
        connection = await createConnection(config);
    }

    return connection;
}
```

## Create an Entity

A TypeORM [entity](https://typeorm.io/#/entities) is a class that maps TypeScript code to a database table.  

### Hippo Entity

{{< file "ts" "src/entity/Hippo.ts" >}}
```typescript
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class Hippo extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    weight: number;

    @Column()
    createdAt: Date;

}
```


## Cloud Functions


### Write to the Database

The first function creates a new record in the database. When called the function will make a connection to the database, then reference the Hippo [repository](https://typeorm.io/#/working-with-repository). The repository is like a reference that exposes methods to read, write, and query a database table.  In this example, we `save` a new record and send the response back to the client. 

{{< file "ts" "src/index.ts" >}}
```typescript
import * as functions from 'firebase-functions';
import { connect } from './config';

import { Hippo } from './entity/Hippo';

export const createHippo = functions.https.onRequest(async (request, response) => {

    const { name, weight } = request.body;

    try {
        const connection = await connect();

        const repo = connection.getRepository(Hippo);

        const newHippo = new Hippo();
        newHippo.name = name;
        newHippo.weight = weight;


        const savedHippo = await repo.save(newHippo);

        response.send(savedHippo);

    } catch (error) {
        response.send(error)
    }

});
```






### Query the Database

TypeORM provides a large collection of methods to reading and querying data. The function below queries all Hippo entities or rows from the database. 

{{< file "ts" "src/index.ts" >}}
```typescript
export const getHippos = functions.https.onRequest(async (request, response) => {

    const connection = await connect();
    const hippoRepo = connection.getRepository(Hippo);

    // Get all rows
    const allHippos = await hippoRepo.find();

    response.send(allHippos);

});
```

### Serve the Cloud Functions

Run the command below to serve the Cloud Functions on localhost.  

{{< file "terminal" "command line" >}}
```text
firebase serve --only functions
```

I highly recommend using a REST client like [Insomnia](https://insomnia.rest/) to make requests to functions efficiently.

{{< figure src="img/http-insomnia.png" >}}


## Advanced

### Relational Data

TypeORM provides a variety of decorators for modeling relational data. 

In the code below, a second entity or database table `Hat` is created. Each hat record is owned by one `Hippo`, but a hippo can own multiple hats. 

{{< file "ts" "src/entity/Hippo.ts" >}}
```typescript
import { Hat } from './Hat';

@Entity()
export class Hippo extends BaseEntity {

    //...

    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(type => Hat, hat => hat.owner)
    hats: Hat[];
}
```

The `owner` field references the primary key or ID of a Hippo entity. 

{{< file "ts" "src/entity/Hat.ts" >}}
```typescript
import { Hippo } from './Hippo'

@Entity()
export class Hat extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Hippo, hippo => hippo.hats)
    owner: Hippo;
}
```

The entity relationship allows us to make a JOIN query to the database to query all Hippos, along with all the hats they own. 

{{< file "ts" "src/index.ts" >}}
```typescript
export const getHippos = functions.https.onRequest(async (request, response) => {

    const connection = await connect();
    const hippoRepo = connection.getRepository(Hippo);

    // JOIN Query
    const hipposWearingHats = await hippoRepo
                                .createQueryBuilder('hippo')
                                .leftJoinAndSelect('hippo.hats', 'hat')
                                .getMany();

    response.send(hipposWearingHats);

});


export const createHat = functions.https.onRequest(async (request, response) => {

    const { owner, color } = request.body;

    const connection = await connect();
    const repo = connection.getRepository(Hat);

    const newHat = new Hat();
    newHat.owner = owner;
    newHat.color = color;

    const savedHat = await repo.save(newHat);
    response.send(savedHat);
});

```


### Listeners

A TypeORM [listener](https://typeorm.io/#/listeners-and-subscribers) allows you hook into the database lifecycle. For example, we may want to add a timestamp to a record before it is inserted in the database.

{{< file "ts" "entity/Hippo.ts" >}}
```typescript
@Entity()
export class Hippo extends BaseEntity {

    //...

    @Column()
    createdAt: Date;


    @BeforeInsert()
    addTimestamp() {
        this.createdAt = new Date();
    }
}
```
