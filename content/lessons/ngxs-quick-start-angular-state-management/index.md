---
title: NGXS Quick Start
lastmod: 2018-04-06T13:32:39-07:00
publishdate: 2018-04-06T13:32:39-07:00
author: Jeff Delaney
draft: false
description: How to use NGXS for state management in Angular 
tags: 
    - angular

youtube: SGj11j4hxmg
github: https://github.com/codediodeio/ngrx-vs-ngxs
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

In this lesson we will get up and running with [NGXS](https://github.com/ngxs/store) - a redux-style state management system for Angular. My goal in this lesson is to get you familiar with the core concepts that underpin this library and make some balanced comparisons to [NgRx](https://github.com/ngrx/platform). 

<p class="warn">This article is a work in progress. Let me know what you think about NGXS in the comments. </p> 

## NgRx vs NGXS

The big question on everybody's mind is how does NGXS compare to NgRx? 

{{< figure src="img/ngxs-vs-ngrx.gif" caption="Comparison of NgRx and NGXS for Angular State Management" >}}

### Similarities

Both libraries...

- use a unidirectional data flow (Redux, CQRS)
- use a single immutable data store
- are compatible with Redux dev tools

### Differences

NGXS...

- does not use switch-style reducers, but gives you a *StateContext* object to mutate the store in response to an action. 
- allows you to perform async operations within the state context (as opposed to listening to an Action stream)
- uses a `@select` decorator to slice state
- can pluck a snapshot of the state as a plain JS object
- supports plugins


### So which one is better?

There's no right answer here. NgRx is a well-maintained and stable library with a track record in the wild, but NGXS offers significant advantages in boilerplate reduction, code readability, and extendability. Give both of them a test drive and choose the one feels right - or none at all - state management libraries are optional after all.  


## Store and State

**Store** is a global immutable object that represents your app's entire data state tree. 
You change the state of the store by dispatching actions. 

You will interact with the store by selecting data and dispatching actions, for instance: 

```typescript
// Read data as an observable
store.select('user')

// Dispatch an action to the store
store.dispatch(UpdateName);
```

**States** are classes that give you a context for modeling, selecting, and handling changes to your data.

Compared to NgRx, you can think of *State* as a unification of Reducers, Effects, and Selectors.

```typescript
interface UserStateModel {
  name: string;
  age: number;
}

@State<UserStateModel>({
  defaults: {
    name: 'Guest',
    age: 18
  }
})
export class UserState {
  // make the magic happen here
}
```

### Why is NGXS State an awesome concept?

NGXS addresses some of the major [concerns](https://ngxs.gitbook.io/ngxs/introduction/why) that come with using a unidirectional data flow in Angular. 

- Improves code readability
- Avoids Separation-of-Concerns overkill
- Avoids boilerplate overkill
- Integrates with Angular Dependency injection
- Opens the door to Promises and async/await syntax
- Avoids RxJS callback hell when dealing with side effects.
- And lastly, improves code readability!


## Actions

Actions in NGXS are very similar to NgRx, but use use a static property for the type.

```typescript
export class SetUsername {
  static readonly type = 'set username';
  constructor(public payload: string) {}
}
```

You can handle actions inside the state class. Notice how we have a context for mutating the state, there is no need to separate this logic in a reducer and/or action stream.  

```typescript
export class UserState {

    @Action(SetUsername)
    addTopping(context: StateContext<SaladStateModel>, action: SetUsername) {
      const current = context.getState();
      const username = action.payload;

      context.patchState({
        username
      });
    }
}
```

## Select and Select

The `@Select()` decorator is an intuitive way to slice data from the store. 

```typescript
@Select() user$;
@Select(state => state.user.age) age$;
@Select(UserState.getFullName) fullName$;
```

Inside your state, you can use the `@Selector` decorator to build your own slicing logic. 

```typescript
export class UserState {
    @Selector()
    static getFullName(user: UserStateModel) {
        return user.firstName + user.lastName;
    }
}
```