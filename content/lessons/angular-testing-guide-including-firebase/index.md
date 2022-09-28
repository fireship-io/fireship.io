---
title: Angular Testing Guide
lastmod: 2017-11-30T12:37:48-07:00
publishdate: 2017-11-30T12:37:48-07:00
author: Jeff Delaney
draft: false
description: Use test-driven development in Angular with Firebase
tags: 
    - angular
    - testing
    - firebase

youtube: BumgayeUC08
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

[Testing your Angular app](https://angular.io/guide/testing) requires more development effort in the short-term, but can prevent bugs and regressions that will save you time, money, and headache in the long-term.

Testing is the [single-most effective tool](https://medium.com/javascript-scene/the-shocking-secret-about-static-types-514d39bf30a3) for preventing software bugs. That's not just my opinion, it is a scientifically proven fact backed by [empirical studies](http://www.sserg.org/publications/uploads/04b700e040d0cac8681ba3d039be87a56020dd41.pdf).


{{< figure src="img/tdd-study.png" >}}

*Source: Effects of Test-Driven Development: A
Comparative Analysis of Empirical Studies. Simo Mäkinen and Jürgen Münch. University of Helsinki.*

Angular uses it's own testing utilities, combined with the popular JavaScript libraries [Jasmine](https://jasmine.github.io/2.4/introduction.html) and [Karma](https://karma-runner.github.io/1.0/index.html), to make it easy for developers to test their code.  When frontend JavaScript frameworks first hit the scene, a lack of test-ability was one of their harshest criticisms. Today, testing in Angular is as powerful as any other software development field.  

## High Level Overview

- **Component Tests**: We are going to focus primarily on [shallow component tests](https://vsavkin.com/three-ways-to-test-angular-2-components-dcea8e90bd8d), which render a component's HTML and CSS. We will also test async operations and integrate the component's dependencies, including AngularFire2. 
- **End-to-End**: Also called *functional testing*, these types of tests will simulate the user experience by running your app through the browser. This allows you to test critical activities, such the user sign-up flow, from start to finish. 


{{< figure src="img/karama-spec-angular.gif" caption="The Karma test runner in Angular" >}}

### Let the CLI handle Boilerplate

The angular CLI handles virtually all of the boilerplate code required to run tests.  Let's quickly demystify all of the testing boilerplate you would find in a new Angular app. 

1. `karma.conf` - Tells Karma [how to run your tests](http://karma-runner.github.io/1.0/config/configuration-file.html).
2. `protractor.conf` - Tells proteactor how to run end-to-end tests
3. `e2e` - Your end-to-end tests are kept here
4. `src/test.ts` - recursively loads all the spec and framework files for testing
5. `**.spec.ts` - Anything you generate with the CLI includes a spec file where you define the actual tests. 


### Anatomy of a Jasmine Test Suite

Testing is really easy - don't overthink it. 

1. `describe` what your testing. This is your test `suite`.  
2. `it` should have some expected behaviors. These are your `specs`. 
4. `expect` or assert these behaviors to hold true. These are your `expectations`

```js
describe('MyAwesomeComponent', () => {
  beforeEach( () => {
    // reproduce the test state
  })

  it('should be awesome', () => {
    expect(component).toBe(awesome)
  });

  // More specs here

})
```

Executing your test suite is as easy as running one of the follow commands:

```shell
ng test
ng e2e
```

Angular will re-run your test suite whenever a file changes so you can immediately detect failing code. 


### What is a Test Bed?

First, we need to learn about concept of a *Test Bed*. If you're unfamilar with [NgModules](https://angularfirebase.com/lessons/a-simple-explanation-of-ngmodule/) at this point, I recommend watching the linked video to get up to speed. 

A Test Bed creates an Angular testing module, which is just a class an NgModule class. For example, notice how you have the `declarations: [ AlertButtonComponent ]` meta data just like any NgModule. This makes it possible to test your components in isolation. 

```typescript
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertButtonComponent ]
    })
    .compileComponents();
  }));
```

### What is a Fixture?

In TDD, a test fixture creates a repeatable baseline for running tests. The `beforeEach` method initializes the `AlertButtonComponent` class in in the same way for each test. In this case, we also want to trigger change detection on the component with `detectChanges`. You can also trigger other lifecycle hooks here, such as `destroy`. 

```typescript
  beforeEach(() => {
    fixture = TestBed.createComponent(AlertButtonComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });
```

At this point, we have a pattern that can be repeated before each test. Now let's go over some of the most common tests you might need to write for a component. 

## Building the Component and Service

Most of your testing is likely to be conducted in Components. For this demo, I am generating an alert button that will undergo a battery of tests. 

```typescript
ng g component alert-button
ng g service message
```

Now let's build the component. It's nothing more than a button the user can click that will show/hide the button's alert message. I commented out the the Observable data for now, but those lines will be used when we test data that is queried from an API. 

```typescript
import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';
import { Observable } from 'rxjs/Observable';
import { timer } from 'rxjs/observable/timer';

@Component({
  selector: 'app-alert-button',
  templateUrl: './alert-button.component.html',
  styleUrls: ['./alert-button.component.scss']
})
export class AlertButtonComponent implements OnInit {

  // content: Observable<any>; 

  content     = 'you have been warned';
  hideContent = true;
  severity    = 423;

  constructor() { }
  // constructor(private msgService: MessageService) { }
  

  ngOnInit() {
    // this.content = this.msgService.getContent();
  }

  toggle() {
    this.hideContent = !this.hideContent;
  }

  toggleAsync() {
    timer(500).subscribe(() => {
      this.toggle();
    });
  }

}
```

## Seven Simple Tests

Well-written tests can be read and understood by a non-programmer. Jasmine provides a bunch of [matchers](https://jasmine.github.io/api/2.6/matchers.html) that help you write expressive tests. Try to make them say exactly how your component should behave - this is the foundation of Behavior Driven Development (BDD). 

### 1. Is something truthy or falsey? 

Truthy means the item *will evalualte to true* on a conditional test, it does not have be a primitive *true*. 

`toBeTruthy()` is like saying `something == true`

```typescript
  it('should create', () => {
    expect(component).toBeTruthy();
  });
```

Its polar opposite `toBeFalsey()` is like saying `something == false`. It will pass for values like `false`, `null`, `0`, `undefined` and so on. 


### 2. Is something an exact value?


```typescript
  it('should have an severity level of 423', () => {
    expect(component.severity).toBe(423);
  });
```

Other useful related matchers include `toEqual()`, `toBeDefined()` and `toBeNull()`. 


### 3. Does something contain another value?

You can see if a string contains a substring, or if an array contains a specific element. 


```typescript
  it('should have a message with `warn`', () => {
    expect(component.content).toContain('warn');
  });
```

For more complex string matching you can use regex. 

```typescript
  it('should have a message with `warn`', () => {
    expect(component.message).toMatch(/string$/);
  });
```

### 4. Does something meet a logical condition?

Logical tests allow you to make numeric comparisons and work just like operators they describe, i.e. `>`, `>=`, and so on. 

```typescript
  it('should have a serverity level greater than 2', () => {
    expect(component.severity).toBeGreaterThan(2);
  });

```

### 5. Does a method work as expected?

The `toggleMessage` method on the component changes the value of a boolean variable on the component. Many of your tests will combine expectations to simulate how a certain variable reacts to changes.

```typescript
  it('should toggle the message boolean', () => {
    expect(component.showMessage).toBeFalsy();
    component.toggleMessage();
    expect(component.showMessage).toBeTruthy();
  });
```

### 6. Does a DOM element get rendered correctly?

The `DebugElement` makes it possible to query DOM elements in the component tempate to ensure they are rendered properly. 


```typescript
  it('should have an h1 tag of `Alert Button`', () => {
    expect(de.query(By.css('h1')).nativeElement.innerText).toBe('Alert Button');
  });
```

### 7. Test Async Operations 

So far, everything all the tests I've shown you have been synchronous, but Angular apps rely heavily on async activity. Let's say we add a 500ms RxJS timer when toggling the message visibility. 

```typescript
  // alert-message.component.ts
  import { timer } from 'rxjs/observable/timer';

  // wait 500ms before changing the variable value
  toggleAsync() {
    timer(500).subscribe(() => {
      this.toggle();
    });
  }
```

We can test this code by running it inside a fake async zone, then using `tick()` with the number of of milliseconds to simulate the passage of time. 

```typescript
  // Async
  it('should toggle the message boolean asynchronously', fakeAsync(() => {
    expect(component.hideContent).toBeTruthy();
    component.toggle();
    // tick(499); // fails
    tick(500);   // passes
    expect(component.hideContent).toBeFalsy();
  }));
```

You can also test the value of contained inside an Observable. 

```typescript
  it('should have message content defined from an observable', fakeAsync(() => {

    component.content.subscribe(content => {
      expect(content).toBe('You have been warned');
    });
    
  }));
```

That's a good start, but there's a lot more to testing. To demonstrate some more advanced testing concepts, let's test our component with an external data source. 

 
## How I Test Data Sources like AngularFire2

Testing Firebase in Angular can be pretty tricky. The Firebase SDK performs a good deal of magic under the hood that is hard to reproduce as a mock backend. My typical strategy is to use simple stubs and spys that return observables for component unit tests. I also like to use protractor e2e testing as an additional sanity check that the UI works as intended. Let's start with the easiest approach - create a [stubbed](https://en.wikipedia.org/wiki/Test_stub) service. 


### Test an Async Service with a Stub

Although it's possible to run tests with live data, it is safer and easier to use a stub for testing. The stub will just simulate [AngularFire2](https://github.com/angular/angularfire2) by returning an Observable of some testing data. 

The important changes are here: 

```typescript
import { MessageService } from '../message.service';
import { of } from 'rxjs/observable/of';
/// ...omitted

    // stub mirrors what AngularFire2 would return from the service
  beforeEach(async(() => {

    serviceStub = {
      getContent: () => of('You have been warned'),
    };

    TestBed.configureTestingModule({
      declarations: [ AlertButtonComponent ],
      providers: [ { provide: MessageService, useValue: serviceStub } ]
    })
    .compileComponents();
  }));

  /// ...omitted

  it('should have message content defined from an observable', () => {
    component.content.subscribe(content => {
      expect(content).toBeDefined();
      expect(content).toBe('You have been warned');
    });
  });
```

That spec is not very useful on its own, but you can now use the stubbed data to run tests in your component without making live requests to Firebase. 


### Test an Async Service with a Spy

The main drawback with a stub is that you can't keep track of how the method was called or what arguments were passed to it. In certain cases, it can be beneficial to use a spy, which is like a stub, but records how it was called in the test. This allows you to catch problems related to methods being called multiple times or with the wrong arguments. You create spies by using the actual live service, but setting a stubbed return value so a live HTTP request is never made. 

```typescript
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

describe('AlertButtonComponent', () => {
  let component: AlertButtonComponent;
  let fixture: ComponentFixture<AlertButtonComponent>;
  let de: DebugElement;

  let service: MessageService;
  let spy: jasmine.Spy;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule
      ],
      declarations: [ AlertButtonComponent ],
      providers: [ MessageService ]
    })
    .compileComponents(); 
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertButtonComponent);
    component = fixture.componentInstance;
    
    service = de.injector.get(MessageService);
    spy = spyOn(service, 'getContent').and.returnValue(of('You have been warned'));

    fixture.detectChanges();
  });

  it('should call getContent one time and update the view', () => {
    
    expect(spy).toHaveBeenCalled();
    expect( spy.calls.all().length ).toEqual(1);

    expect(de.query(By.css('.message-body')).nativeElement.innerText)
      .toContain('warn');

  });

});
```
## End-to-End (e2e) Testing with Protractor

Protractor documentation is limited, but it is the coolest testing tool Angular has to offer in my opinion. Unlike the isolated tests we created in the previous section, it will simulate how an end user experiences your app by running it on a web browser. You can click buttons, fill out forms, and iteract with the app in a very natural way. 

When it comes to testing the complex realtime behavior of Firebase, it is often much easier to write e2e tests, rather than try to simulate edge cases with a mock backend. If you go this route, I highly recommend setting up [separate development and production projects](https://angularfirebase.com/lessons/development-and-production-environments-for-angular-firebase-projects/) in Firebase so you don't accidentally screw-up all of your live user data. 


{{< figure src="img/protractor-spec-angular.gif" caption="" >}}


### Dealing with Web Sockets

Firebase uses websockets to maintain a realtime connection to the server. Protractor sees this as a pending operation that will cause your tests to timeout. There is a community-maintained [plugin](https://www.npmjs.com/package/protractor-testability-plugin) that can help prevent this issue for now, but the issue should be resolved in the future. 

Install it to dev-dependencies: 

```shell
npm install --save-dev protractor-testability-plugin
```
Then add it to `protractor.conf.js`:

```js
plugins: [{
    package: 'protractor-testability-plugin'
}],
```

### Page Objects app.po.ts

The `app.po.ts` is where you define the actual elements from the DOM that you want to interact with or test. You can grab elements by their CSS class, ID, or tag name, then you can test their content or interact with them. 

In this example, we will test the alert message by then clicking its toggle button, then test that it's message was asynchronously populated by AngularFire2.


```typescript
import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  get title() {
    return element(by.css('app-root h1')).getText();
  }

  get toggleButton() {
    return element(by.tagName('button'));
  }

  get alertMessage() {
    const el = element(by.className('message-body'));
    return el ? el.getText() : null;
  }
}
```

### app.e2e-spec.ts

You can see the Jasmine test format is almost identical to the the unit tests we wrote earlier. 

```typescript
import { AppPage } from './app.po';

describe('My Awesome App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    page.navigateTo();
  });

  it('should display welcome message', () => {
    expect(page.title).toEqual('Alert Button');
  });

  it('should not display the alert message', () => {
    expect(page.alertMessage).toBeFalsy();
  });

  it('should display the alert message after clicking toggle button', () => {
    const btn = page.toggleButton;
    let content = page.alertMessage;

    expect(btn).toBeDefined();  
    expect(content).toBeFalsy();  
    
    btn.click();

    content = page.alertMessage;
    expect(content).toContain('warn');  
  
  });
});
```

## The End

That's it for component testing basics. Let me know if you have any questions in the comments or chat with me on Slack. 