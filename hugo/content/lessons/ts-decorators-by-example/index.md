---
title: TypeScript Decorators by Example
lastmod: 2019-02-03T09:39:23-07:00
publishdate: 2019-02-03T09:39:23-07:00
author: Jeff Delaney
draft: false
description: Learn how to use TypeScript decorators to create elegant abstractions with JavaScript code. 
tags: 
    - typescript
    - react
    - angular

youtube: O6A-u_FoEX8
github: https://github.com/fireship-io/163-typescript-decorators-examples
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

One of coolest, yet least approachable features in TypeScript is the [Decorator](https://www.typescriptlang.org/docs/handbook/decorators.html). We see Decorators implemented by the Angular Framework for classes like `@Component`, properties like `@ViewChild`, and methods like `@HostListener`, but have you ever considered building your own from scratch? They seem magical 🍄 in practice, but they are just JavaScript functions that allow us to annotate our code or hook into its behavior - this is known as [Metaprogramming](https://en.wikipedia.org/wiki/Metaprogramming). 

There are five ways to use decorators and we will look at examples of each one.  

- class declaration
- property
- method 
- parameter
- accessor 

{{< box icon="fire" class="box-orange" >}}
Decorators are very good at creating abstractions - almost too good. While it is tempting to create a decorator for all of the things, they are best suited for stable logic that needs to be duplicated in many places. 
{{< /box >}}


## Class Decorator

A class decorator makes it possible to intercept the `constructor` of class. They are called when the class is declared, not when a new instance is instantiated. 

Side note - one of the most powerful characteristics of a decoractor is its ability to *reflect metadata*, but the casual user will rarely need this feature. It is more suitable for use in frameworks, like the Angular Compiler for example, that need to to analyze the codebase to build the final app bundle. 

### Example

**Real World Use Case:** When a class is decorated you have to be careful with inheritence because its decendents will not inherit the decorators. Let's freeze the class to prevent inheritence completely. 

{{< file "ngts" "hook.component.ts" >}}
{{< highlight typescript >}}
@Frozen
class IceCream {}

function Frozen(constructor: Function) {
  Object.freeze(constructor);
  Object.freeze(constructor.prototype);
}

console.log(Object.isFrozen(IceCream)); // true

class FroYo extends IceCream {} // error, cannot be extended
{{< /highlight >}}


## Property Decorator

{{< box icon="scroll" class="box-blue" >}}
All of the examples in this guide use *Decorator Factories*. This just means the decorator itself is wrapped in a function so we can pass custom arguments to it, i.e `@Cool('stuff')` Feel free to omit the outer function if you want to apply a decorator without arguments `@Cool` . 
{{< /box >}}

Property decorators can be extremly useful because they can listen to state changes on a class. To fully understand the next example, it helps to be familar with JavaScript [PropertyDescriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). 

### Example

Let's override the flavor property to surround it in emojis. This allows us to set a regular string value, but run additional code on get/set as *middleware*, if you will. 

{{< file "ngts" "ice-cream.component.ts" >}}
{{< highlight typescript >}}
export class IceCreamComponent {
  @Emoji()
  flavor = 'vanilla';
}


// Property Decorator
function Emoji() {
  return function(target: Object, key: string | symbol) {

    let val = target[key];

    const getter = () =>  {
        return val;
    };
    const setter = (next) => {
        console.log('updating flavor...');
        val = `🍦 ${next} 🍦`;
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });

  };
}

{{< /highlight >}}

## Method Decorator

Method decoractors allow us override a method's function, change its control flow, and execute additional code before/after it runs. 

### Example

The following decoractor will show a confirm message in the browser before executing the method. If the user clicks cancel, it will be bypassed. Notice how we have two decoractors stacked below - they will be applied from top to bottom. 


{{< file "ngts" "ice-cream.component.ts" >}}
{{< highlight typescript >}}
export class IceCreamComponent {

  toppings = [];

  @Confirmable('Are you sure?')
  @Confirmable('Are you super, super sure? There is no going back!')
  addTopping(topping) {
    this.toppings.push(topping);
  }

}


// Method Decorator
function Confirmable(message: string) {
  return function (target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

      descriptor.value = function( ... args: any[]) {
          const allow = confirm(message);

          if (allow) {
            const result = original.apply(this, args);
            return result;
          } else {
            return null;
          }
    };

    return descriptor;
  };
}


{{< /highlight >}}

## React Hooks for Angular 🤯

You've probably heard that [React Hooks](https://reactjs.org/docs/hooks-intro.html) are a game-changer for the web. Is there any chance Angular can catch up to produce code that is equally beautiful, succinct, and game-changing? Well, yes actually, and it has been able to do this from day one. 

{{< figure src="img/react-hooks-gamechanger.png" alt="React hooks game changer results" >}}

### UseState Property Decorator

In react, the *useState* hook provides you with a reactive variable `count` and a setter `setCount`. 


{{< file "jsx" "hook.jsx" >}}
{{< highlight jsx >}}
import { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
{{< /highlight >}}

We can achieve a *similar* results with a property decorator that will first define the `count` on the component - this is trival because Angular performs automatic change detection. We then use the name of this property to define a setter with the name of `setCount`. Usage looks like this:

{{< file "ngts" "hook.component.ts" >}}
{{< highlight typescript >}}
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <p>You clicked {{count.value}} times</p>
    <button (click)="setCount(count.value + 1)">Click Me</button>
  `,
})
export class HookComponent {
  @UseState(0) count; setCount;
}
{{< /highlight >}}

And the decoractor implementation is just five lines of code. We just set an initial value, then find the cooresponding

{{< highlight typescript >}}
function UseState(seed: any) {
  return function (target, key) {
    target[key] = seed;
    target[`set${key.replace(/^\w/, c => c.toUpperCase())}`] = (val) => target[key] = val;
  };
}
{{< /highlight >}}


### UseEffect Method Decorator

The [effect hook](https://reactjs.org/docs/hooks-effect.html) hook simply consolidates the component lifecycle of `componentDidMount` and `componentDidUpdate` into a single callback. 


{{< file "jsx" "hook.jsx" >}}
{{< highlight jsx >}}
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });
{{< /highlight >}}

This is very easy to emulate with a method decorator because we can apply the function descriptor to Angular's equivelent `ngOnInit` and `ngAfterViewChecked` lifecycle hooks. 

{{< file "ngts" "hook.component.ts" >}}
{{< highlight typescript >}}
@Component(...)
export class AppComponent {
  @UseEffect()
  onEffect() {
    document.title = `You clicked ${this.count.value} times`;
  }
}


/// Implementation Details:

function UseEffect() {
  return function (target, key, descriptor) {
    target.ngOnInit = descriptor.value;
    target.ngAfterViewChecked = descriptor.value;
  };
}
{{< /highlight >}}
