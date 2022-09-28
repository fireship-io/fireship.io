---
title: Object Oriented Programming with Typescript
lastmod: 2018-12-10T15:34:28-07:00
publishdate: 2018-12-10T15:34:28-07:00
author: Patrick Mullot
draft: false
description: Learn Object Oriented Programming (OOP) basics with TypeScript
tags: 
    - typescript

youtube: fsVL_xrYO0w
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

OOP is usually defined by its two core concepts: Polymorphism and Inheritance. Although both concepts are related, they are not the same.

In this article, we’ll take a simple approach to Inheritance, as it’s the most representative of the two.

But instead of getting bored with theory and definition, let’s take a look at a real life example, that illustrates perfectly the advantages of Inheritance.

Like all apps, our example web app needs, at some point, to persist some data to a database. Angular provides us with Services that are a great help to centralize the CRUD (Create Read Update Delete) operations and respect the separation of concern paradigm that we all should follow (yes, you too, js developer!)

## Interface Inheritance

When dealing with representation of database rows/records in Typescript, it’s highly recommendable to define a model of your data. This way, you make sure that what’s on the database will match what’s you’re expecting in your code. This is done through interfaces.

Let’s imagine we have two kinds of models: Humans and Transformers.
Both models are defined as follow:

```typescript
export interface IHuman {
    Id: string;
    name: string;
    photo?: string;
    sex: string;
    age: number;
    health: number;
}
```

```typescript
export interface ITransformer {
    Id: string;
    name: string;
    photo?: string;
    wings: number;
    wheels: number;
    clan: string;
}
```

As we can see, both interfaces share the same basic information: id, name, photo. Ring a bell?

Well, this is quite inefficient… What if, instead of two models, we had 30? And what if we wanted to add a new core property, common to all models? We would have to modify each and every one of them… 

If you’re a real programmer, you’re lazy by nature; meaning that if there was a way to change that property just once, and affect all the models that would be awesome, right?

That’s where inheritance comes into play:

Let’s write an interface that defines the common properties of our models:

```typescript
export interface IHero {
    id: string;
    name: string;
    photo?: string;
}
```

Now, let’s rewrite our previous 2 interfaces, using IHero as a parent interface

```typescript
export interface IHuman extends IHero {
    sex: string;
    age: number;
    health: number;
}

export interface ITransformer extends IHero {
    wings: number;
    wheels: number;
    clan: string;
}
```

Now, both IHuman and ITransformer are descendant of IHero. This means that they both inherit all the properties of IHero. Any change made in IHero will automatically be available in all its descendant interfaces. Handful, isn’t it?

## Class Inheritance

Class inheritance works exactly the same as with interfaces, except that the children/descendants not only inherit properties, they also inherit functions and methods.

In a typical Angular application, you will very often create Components that will display a form to update/create data, then use a service, through dependency injection, to save those data to the database. 
But that’s not all!

What you also usually need, is a set of functions, inside each component that you call from the html template (the view) and which, in their turn, call the pertinent service function. Those functions tends to be extremely similar, if not the same, in all your components.

Take this one, for example:

```typescript
constructor( private dbService: DBService) {}

public save( data ) {
    if( data ) {
        this.dbService.saveData(data);
    }
}
```

This *save* function doesn’t do much… It’s just a proxy to the save function of the `dbService`. However, you need it to enable your view to communicate with the controller. 

And you will also need a `createData` method, a `deleteData` method, etc.. And you will need them in every component that requires to store data through the DBService. That’s a lot of typing - remember DRY!

As with our interfaces, what if we had 30 components in our app, each one with 3 proxy functions for CRUD operation that would be exactly (or almost exactly) the same? And what if we had to change the save function inside DBService, let’s say, add a 2nd parameter? We would have to change all the references to that function everywhere in our code! That’s crazy!

So let’s use inheritance to solve this problem:

We create a class that we’ll call Persister.

In this class, we’ll define our 3 CRUD functions: save, delete and add.
We’ll also write a constructor that will accept our DBService as a parameter and that will be used by our 3 functions.

```typescript
export class Persister {

    constructor( private dbService: DBService ) {}

    public save( data ) {
        if ( data ) {
            this.dbService.saveData( data );
        }
    }

    public add( data ) {
        if ( data ) {
            this.dbService.addData( data );
        }
    }


    public delete( data ) {
        if ( data ) {
            this.dbService.deleteData( data );
        }

}
```


Now, we create a new Component, that will extend our Persister class. 

```typescript
@Component({
  select: ‘app-humans’,
})
export class HumansComponent extends Persister {

    constructor( private dbService: DBService ) {
        super( dbService )
    }

    public doStuffOnlyHumansCanDo() { 
    
    }
}
```

<p class="tip">Note the `super( dbService )` line in the constructor. As this class is a descendant, it needs to instantiate its parent. `super( dbService )` tells Typescript to do that and at the same time, pass it the dbService, as required by the parent constructor.</p>
