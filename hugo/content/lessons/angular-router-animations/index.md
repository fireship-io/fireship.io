---
title: Angular Router Animations Guide
lastmod: 2019-02-10T07:42:41-07:00
publishdate: 2019-02-10T07:42:41-07:00
author: Jeff Delaney
draft: false
description: Build beautiful router animations in Angular to transition between page changes.
tags: 
    - angular
    - animation

youtube: 7JA90VI9fAI
github: https://github.com/fireship-io/165-angular-router-animations
# disable_toc: true
# disable_qna: true

# courses
# step: 0

versions:
   '@angular/core': 7.3
---

Smooth animated router transitions will impress your users and set your app apart from the crowd. In the following lesson, you will learn how to build complex [router transition animations](https://angular.io/guide/route-animations) in Angular.

{{< figure src="img/router-animations.gif" alt="Angular router animations demo" >}}

Here's a summary of the animations that we will build from scratch. 

- *fader* basic fade in
- *slider* slide in from left or right
- *transformer* translate, scale, and rotate
- *stepper* complex keyframed animation sequences

## Router Animations Setup

Let's start by taking care of the initial Angular Router animations boilerplate. Also, generate a few components so we have some content to route to. 

### Import the BrowserAnimationsModule

{{< file "ngts" "app.module.ts" >}}
{{< highlight typescript >}}
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    RightPageComponent,
    LeftPageComponent,
    AboutPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule // <-- here
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
{{< /highlight >}}

### Wrap the Router Outlet

{{< file "html" "app.component.html" >}}
{{< highlight html >}}
<div [@routeAnimations]="prepareRoute(outlet)" >
  <router-outlet #outlet="outlet"></router-outlet>
</div>
{{< /highlight >}}

The animations must be included in the app component. Uncomment the name of the animation you wish to use. 

{{< file "ngts" "foo.component.ts" >}}
{{< highlight typescript >}}
@Component({
  selector: 'app-root',
  animations: [ // <-- add your animations here
    // fader,
    // slider,
    // transformer,
    stepper
  ]
})

prepareRoute(outlet: RouterOutlet) {
  return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
}
{{< /highlight >}}

### Variable Animations with Router Data (Optional)

We can pass data into the router to customize animations on a component-by-component basis. For example, we might want apply different animations for components based on their perceived position in the UI. 

{{< file "ngts" "app-routing.module.ts" >}}
{{< highlight typescript >}}
const routes: Routes = [
  { path: 'about', component: AboutPageComponent },
  { path: 'right', component: RightPageComponent, data: { animation: 'isRight' } },
  { path: 'left', component: LeftPageComponent, data: { animation: 'isLeft' } },
];
{{< /highlight >}}

## Create the Animations

Now it's time for the fun part - animating. Let's look at four animation examples that become increasingly more complex after each step. 


Create a file named *route-animations.ts* in the app dir.

{{< file "ngts" "route-animations.ts" >}}
{{< highlight typescript >}}
import {
    trigger,
    transition,
    style,
    query,
    group,
    animateChild,
    animate,
    keyframes,
  } from '@angular/animations';
{{< /highlight >}}


### Basic Fade In

Let's start with a basic animation that is applied the same for every route. 

<video controls src="https://firebasestorage.googleapis.com/v0/b/fireship-app.appspot.com/o/assets%2FE165-RouterAnimations%2F14-basic-demo.mp4?alt=media&token=042fb010-8a12-45b1-aaf4-9abae25b4b9a"></video>

A few important notes about the code below: 

- The trigger name of *routeAnimations* must match the trigger used in the app component HTML. 
- Using wildcard syntax like `* <=> *` applies the default animation to all routes. 
- When an animation is triggered we have access the the previous page via the `:leave` selector, and the current page via the `:enter` selector. We can query these elements to style and animate them. 

The animation below first hides both pages, then defines an animation to fade in the new page. 

{{< file "ngts" "foo.component.ts" >}}
{{< highlight typescript >}}
export const fader =
  trigger('routeAnimations', [
    transition('* <=> *', [
      // Set a default  style for enter and leave
      query(':enter, :leave', [
        style({
          position: 'absolute',
          left: 0,
          width: '100%',
          opacity: 0,
          transform: 'scale(0) translateY(100%)',
        }),
      ]),
      // Animate the new page in
      query(':enter', [
        animate('600ms ease', style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
      ])
    ]),
]);
{{< /highlight >}}


### Slide in from Left or Right

In this example, we will write a function that can be reused to generate an animation for both left and right directions. 

<video controls src="https://firebasestorage.googleapis.com/v0/b/fireship-app.appspot.com/o/assets%2FE165-RouterAnimations%2F14-slide-demo.mp4?alt=media&token=522c3f3f-6a2d-4c5d-81c1-4f8f2a53a423"></video>

- We set different transitions based on the *isLeft* or *isRight* data contiained in the router. 
- *:leave* queries are marked optional because it is not present on the initial page load
- The `group` method is used run multiple animations concurrently. 

{{< highlight typescript >}}
export const slider =
  trigger('routeAnimations', [
    transition('* => isLeft', slideTo('left') ),
    transition('* => isRight', slideTo('right') ),
    transition('isRight => *', slideTo('left') ),
    transition('isLeft => *', slideTo('right') )
  ]);

function slideTo(direction) {
  const optional = { optional: true };
  return [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        [direction]: 0,
        width: '100%'
      })
    ], optional),
    query(':enter', [
      style({ [direction]: '-100%'})
    ]),
    group([
      query(':leave', [
        animate('600ms ease', style({ [direction]: '100%'}))
      ], optional),
      query(':enter', [
        animate('600ms ease', style({ [direction]: '0%'}))
      ])
    ]),
    // Normalize the page style... Might not be necessary

    // Required only if you have child animations on the page
    // query(':leave', animateChild()),
    // query(':enter', animateChild()),
  ];
}
{{< /highlight >}}

### Configurable CSS Transformations

Rather than animating the *right* or *left* style attributes, we can achieve better flexibility and control with a [transform](https://www.w3schools.com/cssref/css3_pr_transform.asp). This demo is similar to the previous sliding animation, but adds a rotation to make it drop and spin in from the top corner. Tweak the named arguments to easily modify its behavior. 

<video controls src="https://firebasestorage.googleapis.com/v0/b/fireship-app.appspot.com/o/assets%2FE165-RouterAnimations%2F14-trans-demo.mp4?alt=media&token=c5083c39-4a9b-44b0-9411-16f712aba6a5"></video>


{{< highlight typescript >}}
export const transformer =
  trigger('routeAnimations', [
    transition('* => isLeft', transformTo({ x: -100, y: -100, rotate: -720 }) ),
    transition('* => isRight', transformTo({ x: 100, y: -100, rotate: 90 }) ),
    transition('isRight => *', transformTo({ x: -100, y: -100, rotate: 360 }) ),
    transition('isLeft => *', transformTo({ x: 100, y: -100, rotate: -360 }) )
]);


function transformTo({x = 100, y = 0, rotate = 0}) {
  const optional = { optional: true };
  return [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], optional),
    query(':enter', [
      style({ transform: `translate(${x}%, ${y}%) rotate(${rotate}deg)`})
    ]),
    group([
      query(':leave', [
        animate('600ms ease-out', style({ transform: `translate(${x}%, ${y}%) rotate(${rotate}deg)`}))
      ], optional),
      query(':enter', [
        animate('600ms ease-out', style({ transform: `translate(0, 0) rotate(0)`}))
      ])
    ]),
  ];
}
{{< /highlight >}}


### Keyframe Sequence

[Keyframes](https://tympanus.net/codrops/css_reference/keyframes/) allow us build an animation in multiple complex steps. The effect below makes it look like the new page pops up from the bottom, then bumps the old page off the screen in explosive fashion. The `offset` property is used by the [Angular keyframe function](https://angular.io/api/animations/keyframes) determine when (as a percent of the total animation time) a style will be applied. In brief, keyframes allow us to compose complex sequences of style changes. 

<video controls src="https://firebasestorage.googleapis.com/v0/b/fireship-app.appspot.com/o/assets%2FE165-RouterAnimations%2F14-keyf-demo.mp4?alt=media&token=b11156cd-ea9e-4ce0-8916-1604f82b26c4"></video>


{{< highlight typescript >}}
export const stepper =
  trigger('routeAnimations', [
    transition('* <=> *', [
      query(':enter, :leave', [
        style({
          position: 'absolute',
          left: 0,
          width: '100%',
        }),
      ]),
      group([
        query(':enter', [
          animate('2000ms ease', keyframes([
            style({ transform: 'scale(0) translateX(100%)', offset: 0 }),
            style({ transform: 'scale(0.5) translateX(25%)', offset: 0.3 }),
            style({ transform: 'scale(1) translateX(0%)', offset: 1 }),
          ])),
        ]),
        query(':leave', [
          animate('2000ms ease', keyframes([
            style({ transform: 'scale(1)', offset: 0 }),
            style({ transform: 'scale(0.5) translateX(-25%) rotate(0)', offset: 0.35 }),
            style({ opacity: 0, transform: 'translateX(-50%) rotate(-180deg) scale(6)', offset: 1 }),
          ])),
        ])
      ]),
    ])

]);
{{< /highlight >}}

