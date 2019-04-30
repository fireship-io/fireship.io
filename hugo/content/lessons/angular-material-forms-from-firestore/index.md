---
title: Angular Material Forms from Firestore
lastmod: 2019-04-29T07:01:58-07:00
publishdate: 2019-04-29T07:01:58-07:00
author: Alex Patterson
draft: false
description: Build all of the Angular Material Form components with data from Firestore.
tags:
  - angular material
  - firebase
  - angular

youtube: LLupkLEszdY
github: https://github.com/AJONPLLC/lesson12-angular-material-forms-firestore
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

# Angular Material Forms from Firestore

🌎 Demo: https://ajonp-lesson-12.firebaseapp.com/books/FirstBook/edit

This lesson will cover how to create all of the [Angular Material Form Components](https://material.angular.io/components/categories/forms), the data behind many of them will be coming from [Cloud Firestore](https://firebase.google.com/docs/firestore/).

# Setup

We will start this lesson from where we left off on [Angular Navigation Firestore](https://ajonp.com/lessons/11-angular-navigation-firestore/)

## Source from Prior lesson

Clone

```sh
git clone https://github.com/AJONPLLC/lesson11-angular-navigation-firestore.git lesson12-angular-material-forms-firestore
```

Remove Origin, just always easier up front if you want to add this to your own repo (or again you can fork and just clone.)

```sh
git remote rm origin
```

## Install Dependencies

Make sure you are in the correct directory `cd lesson12-angular-material-forms-firestore`.

```sh
npm install
```

# Book Edit Module

## Create

Using the Angular CLI create the module with routing and corresponding component.

```sh
ng g m modules/books/book-edit --routing && ng g c modules/books/book-edit
```

# Router updates

## books-routing.module.ts

Add new lazy loaded path so that our main books-routing knows where to send requests for edit.

```ts
...
  {
    path: ':bookId/edit',
    loadChildren: './book-edit/book-edit.module#BookEditModule'
  }
  ...
```

## book-edit-routing.module.ts

Now that we are in the book-edit module make sure it has a path to the book-edit Component.

```ts
...
const routes: Routes = [
  {
    path: '',
    component: BookEditComponent
  }
];
...
```

## Serve the edit path

Startup the server

```sh
ng serve
```

Now that our router is all setup we should start to see the book-edit.component.html. Because we don't have a way to navigate to this path yet just type it in the url bar manually `localhost:4200/books/FirstBook/edit`.

You should see <h3>book-edit works!</h3>

# Update Book Edit

## Structure

To give our form some structure we can now add Flex Layout and Material Card centered at 75% to give a nice look to our form.

book-edit.component.html

```html
<div fxLayout="column" fxLayoutAlign="space-around center">
  <mat-card style="width: 75%; margin-bottom: 100px;">
    <mat-card-content> </mat-card-content>
    <mat-card-actions> <button mat-button>Ok</button> </mat-card-actions>
  </mat-card>
</div>
```

Because these are new Elements we need to import them into our Book Edit module.
book-edit.module.ts

```ts
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatCardModule} from '@angular/material';

...

@NgModule({
  declarations: [BookEditComponent],
  imports: [
    CommonModule,
    BookEditRoutingModule,
    FlexLayoutModule,
    MatCardModule,
  ]
})
...
```

## Getting Firestore Data for Book Edit

Because we are now navigating to an area that uses Angular router and part of the path contains a specified paramter id `:bookId/edit` we can get this `bookId` from the currently Activated Route. In order to do this we need to use dependency injection and provide this in our constructor. To then fetch that data from our `FirestoreService` we can then inject this service as well.

```ts
  subs: Subscription[] = [];
  book$: Observable<Book>;
  constructor(private router: ActivatedRoute, private fs: FirestoreService) {}

  ngOnInit() {
    // Get bookId for book document selection from Firestore
    this.subs.push(
      this.router.paramMap.subscribe(params => {
        const bookId = params.get('bookId');
        this.book$ = this.fs.getBook(bookId);
      })
    );
```

By calling the firestore `getBook` function and passing in the current parameter `bookId` we now have an Observable reference to the Firestore data.

firestore.service.ts

```ts
getBook(bookId: string): Observable<Book> {
  // Start Using AngularFirebase Service!!
  return this.afb.doc$<Book>(`books/${bookId}`);
}
```

> This is a cool wrapper that Jeff over at [fireship.io](https://angularfirebase.com/lessons/firestore-advanced-usage-angularfire/) created.
> Feel free to copy this service and use it as a nice wrapper for all of your projects, I won't include the two calls as we move forward
> angularfirebase.service.ts

```ts
  doc$<T>(ref: DocPredicate<T>): Observable<T> {
    return this.doc(ref)
      .snapshotChanges()
      .pipe(
        map(
          (
            doc: Action<
              DocumentSnapshotDoesNotExist | DocumentSnapshotExists<T>
            >
          ) => {
            return doc.payload.data() as T;
          }
        )
      );
  }
```

Example of Book Data in Firestore Console:

![Book Data](https://res.cloudinary.com/ajonp/image/upload/f_auto,fl_lossy,q_auto/v1548959741/ajonp-ajonp-com/11-lesson-angular-navigation-firestore/yep4ngt60x0ki8jocisx.jpg)

In the snippet above we are also pushing our RxJs Subscription into an array so that we can then loop through any subscriptions during the destroy method and unsubscribe. This is a pattern I often use when I cannot use `pipe(take(1))` or `| async`.

```ts
  ngOnDestroy() {
    this.subs.forEach(sub => {
      sub.unsubscribe();
    });
  }
```

## Using Firestore Data Inside of Template

We can not use our new `book$` Observable in our template to show any of the current data. We can update our card to show only when the book data is available, otherwise show a Material Spinner. You can read more on how the [NgIf](https://angular.io/api/common/NgIf) directive works in the Angular docs if you are unfamiliar.

```html
<mat-card
  *ngIf="(book$ | async); let book; else: spin"
  style="width: 75%; margin-bottom: 100px;"
>
  <mat-card-title>{{book.title}}</mat-card-title>
  ...
  <ng-template #spin><mat-spinner></mat-spinner></ng-template
></mat-card>
```

Current title:
![Title View](https://res.cloudinary.com/ajonp/image/upload/f_auto,fl_lossy,q_auto/v1548960658/ajonp-ajonp-com/11-lesson-angular-navigation-firestore/oclrlecxgwgbhbooidhg.jpg)

## Adding Form Input

> Just a warning here, if you want to see detailed [Angular Reactive Form](https://angular.io/guide/reactive-forms) usage this will be done in the next lesson.

Now that we know our Observable is working successfully we can now change the card title out and start switching our card into several form inputs.

For this we will need to include `FormsModule`, `ReactiveFormsModule`, `MatFormFieldModule`, and `MatInputModule` into our Book Edit Module.

book-edit.module.ts

```ts
  imports: [
    CommonModule,
    BookEditRoutingModule,
    FlexLayoutModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
```

### Title Input

![Title Input](https://res.cloudinary.com/ajonp/image/upload/f_auto,fl_lossy,q_auto/v1548961254/ajonp-ajonp-com/12-angular-material-from-firestore/bvls9ivndkkacihjr2hp.jpg)

The entire Material Card should now look like below, the new div surrounding the card is just to allow each section to flow in its own row of the column. If you have not used [Flex Layout](https://github.com/angular/flex-layout/wiki/fxFlex-API) check out the details.

book-edit.component.html

```html
<mat-card
  *ngIf="(book$ | async); let book; else: spin"
  style="width: 75%; margin-bottom: 100px;"
>
  <mat-card-content>
    <div fxLayout="column" fxLayoutAlign="space-around stretch">
      <section>
        <mat-form-field style="width: 100%">
          <input matInput placeholder="Title" [(ngModel)]="book.title" />
        </mat-form-field>
      </section>
    </div>
  </mat-card-content>
  <mat-card-actions> <button mat-button>Ok</button> </mat-card-actions>
</mat-card>
```

Above we have our first two components

-[Form Field](https://material.angular.io/components/form-field/overview) which you can think of as a wrapper to all of our components allowing for styling of the other form fields.

-[Input](https://material.angular.io/components/input/overview) the key with this is the directive `matInput`, this will allow you to use a native `<input>` or `<textarea>` correctly styled within `<mat-form-field>`.

> If you see any issues at this point, make sure you have imported all the modules into `book-edit.module.ts`

For an extra you can checkout the textarea example too.

```html
<section>
  <mat-form-field style="width: 100%">
    <textarea
      matInput
      placeholder="Description"
      [(ngModel)]="book.description"
      rows="5"
    ></textarea>
  </mat-form-field>
</section>
```

### Slide Toggle

![Slide Toggle](https://res.cloudinary.com/ajonp/image/upload/f_auto,fl_lossy,q_auto/v1548961935/ajonp-ajonp-com/11-lesson-angular-navigation-firestore/m2ox1ibaek2ybrj9wdsr.jpg)

-[Slide Toggle](https://material.angular.io/components/slide-toggle/overview) is a very simple comoponent that is either on or off (binary).

book-edit.module.ts

```ts
  imports: [
    ...
       MatSlideToggleModule,
```

For our requirement we are going to use this to determine whether a book is Fiction or non-fiction.

We will set the default `fictionSelected = true;` so that Fiction is set first.

book-edit.component.ts

```ts
export class BookEditComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  book$: Observable<Book>;
  fictionSelected = true;
```

book-edit.component.html

```html
<section>
  <mat-slide-toggle
    [checked]="fictionSelected"
    (change)="fictionChange($event)"
    #ficToggle
  >
    <p *ngIf="ficToggle.checked; else nonFic">Fiction</p>
  </mat-slide-toggle>
</section>
```

You can see that our input directive `checked` (denoted by `[]`), will now take the value of `fictionSelected` and every time the toggle is changed we will use the output directive `change` (denoted by `()`) to trigger function `fictionChange` passing in the current components instance of the event `$event`. You can read more about [DOM event payloads](https://angular.io/guide/user-input#get-user-input-from-the-event-object).

book-edit.component.ts

```ts
  fictionChange(e) {
    this.fictionSelected = e.checked;
    this.genreControl.reset();
  }
```

### Autocomplete

<video poster="https://res.cloudinary.com/ajonp/image/upload/f_auto,fl_lossy,q_auto/v1548963828/ajonp-ajonp-com/11-lesson-angular-navigation-firestore/bcpt5ojwuwqicbhasl7w.jpg" controls autoplay loop>
<source src="https://res.cloudinary.com/ajonp/video/upload/v1548963680/ajonp-ajonp-com/12-angular-material-from-firestore/autocomplete.webm" type="video/webm">
<source src="https://res.cloudinary.com/ajonp/video/upload/v1548963680/ajonp-ajonp-com/12-angular-material-from-firestore/autocomplete.mp4" type="video/mp4">
</video>

- [Autocomplete](https://material.angular.io/components/autocomplete/overview) is just another input type in our case for text. However it also has a Panel that is associated to provide a list of options. For our use case it will list out two different lists based on our Slide Toggle. So we will either filter the Genere Fiction list of values, or a Non-Fiction list of values.

book-edit.module.ts

```ts
  imports: [
    ...
       MatAutocompleteModule,
```

These two lists will be contained in a new collection at the base of our Firestore Database called `config`. Within our `config` collection we will create a document called `book`, which will hold many of our different configurations. For these two specifically they will be arrays that are on the `book` object.

![Firestore Fiction/Non-Fiction](https://res.cloudinary.com/ajonp/image/upload/f_auto,fl_lossy,q_auto/v1548964455/ajonp-ajonp-com/11-lesson-angular-navigation-firestore/vnxbzg5fnpnuoevun1nu.jpg)

First we will create our Observable to the Config Book object.
book-edit.component.ts

```ts
  bookConfig$: Observable<ConfigBook>;
  ...
    // Set Book Config
    this.bookConfig$ = this.fs.getConfigBook();
```

Create the `ConfigBook` Interface for our type.

```sh
ng g i core/models/config-book
```

config-book.ts

```ts
export interface ConfigBook {
  ageCategory?: Array<string>;
  fiction?: Array<string>;
  nonFiction?: Array<string>;
}
```

Then we can will grab the first set of values emitted from Firestore and send those out as a [BehaviorSubject](http://reactivex.io/rxjs/manual/overview.html#behaviorsubject) with type `ConfigBook`. Our toggle has set `this.fictionSelected` so we can determine what list should be emitted in `this.genereList$`.

book-edit.component.ts

```ts
export class BookEditComponent implements OnInit, OnDestroy {
  ...
  genreControl = new FormControl();
  ...
    // Set default Genere
    this.bookConfig$.pipe(take(1)).subscribe(bookConfig => {
      this.subs.push(
        this.genreControl.valueChanges.pipe(startWith('')).subscribe(value => {
          const filterValue = value ? value.toLowerCase() : '';
          if (this.fictionSelected) {
            this.genreList$.next(
              bookConfig.fiction.filter(option =>
                option.toLowerCase().includes(filterValue)
              )
            );
          } else {
            this.genreList$.next(
              bookConfig.nonFiction.filter(option =>
                option.toLowerCase().includes(filterValue)
              )
            );
          }
        })
      );
    });
```

You will also notice above the we have subscribed to any of the `valueChanges` that are happening on our new `genreControl`. Below you will see that `formControl` input directive is passed our class parameter `genreControl` which is an instance of `FormControl`. We will dive into all of the `@angular/forms` in more detail in the next lesson. For our sake here just know that this allows us to check all of the changing values as you type. When we start to type it uses the arrays that we have passed in from Firestore and filters them based on the string we are inputing using either `bookConfig.fiction.filter` or `bookConfig.nonFiction.filter`.

```html
<section>
  <mat-form-field style="width: 100%">
    <input
      name="genre"
      type="text"
      matInput
      [formControl]="genreControl"
      [matAutocomplete]="auto"
      placeholder="Genre"
      aria-label="Genre"
    />
  </mat-form-field>
  <mat-autocomplete #auto="matAutocomplete">
    <mat-option *ngFor="let genre of (genreList$ | async)" [value]="genre">
      {{ genre }}
    </mat-option>
  </mat-autocomplete>
</section>
```

Above we are listening to the updates from `genreList$` BehaviorSubject to create our `<mat-option>` list of values. Our input has an input directive `[matAutocomplete]="auto"` to attach this `<mat-autocomplete>` by assigning the instance variable `#auto` to the input using `matAutocomplete`.

### Checkbox

![Checkbox](https://res.cloudinary.com/ajonp/image/upload/f_auto,fl_lossy,q_auto/v1548966370/ajonp-ajonp-com/11-lesson-angular-navigation-firestore/hhk37heauwmp6ns7minw.jpg)

> Take a deep breath there was a lot going on with the Autocomplete, the rest get a lot easier 😺

- [Checkbox](https://material.angular.io/components/checkbox/overview) is again providing the same functionality as the native `<input type="checkbox">` enhanced with Material Design.

book-edit.module.ts

```ts
  imports: [
    ...
       MatCheckboxModule,
```

![Firestore Config](https://res.cloudinary.com/ajonp/image/upload/f_auto,fl_lossy,q_auto/v1548966831/ajonp-ajonp-com/11-lesson-angular-navigation-firestore/caewhsmpkrkxdo1dcj2d.jpg)

For us this contains some more of the configuration items from our book, because we already have an Observable created in `bookConfig$` we can just tell Angular to listen for this and assign it to our local template variable `bookConfig`. We then are just assigning these to the directive [NgModel](https://angular.io/api/forms/NgModel). This is a two way binding, for our example doesn't mean much, but again we will drive these things home further in the next lesson.

```ts
<section *ngIf="(bookConfig$ | async); let bookConfig">
  <h3>Options</h3>
  <div fxLayout="column">
    <mat-checkbox [(ngModel)]="bookConfig.options.hasAudio">
      Audio
    </mat-checkbox>
    <mat-checkbox [(ngModel)]="bookConfig.options.hasPhotos">
      Photos
    </mat-checkbox>
    <mat-checkbox [(ngModel)]="bookConfig.options.hasVideos">
      Videos
    </mat-checkbox>
  </div>
</section>
```

### Datepicker

![Date Picker](https://res.cloudinary.com/ajonp/image/upload/f_auto,fl_lossy,q_auto/v1548967267/ajonp-ajonp-com/11-lesson-angular-navigation-firestore/eaz6tqu7haioisymv83l.jpg)

- [Datepicker](https://material.angular.io/components/datepicker/overview) The datepicker allows users to enter a date either through text input, or by choosing a date from the calendar. It is made up of several components and directives that work together.

> Special note here you need `MatNativeDateModule` in addition to the `MatDatepickerModule`.

book-edit.module.ts

```ts
  imports: [
    ...
       MatDatepickerModule,
       MatNativeDateModule
```

This is just creating the pre canned datepicker. We don't have any data that will will bring in currently to update this field. We will cover this in the next lesson.

book-edit.component.html

```html
<section>
  <mat-form-field>
    <input matInput [matDatepicker]="picker" placeholder="Publish Date" />
    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
    <mat-datepicker #picker></mat-datepicker>
  </mat-form-field>
</section>
```

### Select

![Select](https://res.cloudinary.com/ajonp/image/upload/f_auto,fl_lossy,q_auto/v1548967053/ajonp-ajonp-com/11-lesson-angular-navigation-firestore/wos1r5ksaofipa6fbmhb.jpg)

- [Select](https://material.angular.io/components/select/overview) you can use either the Material Select, or the native select within the `<mat-form-field>`. The native control has several performance advantages...but I really like the style of using the Material Design.

book-edit.module.ts

```ts
  imports: [
    ...
       MatSelectModule,
```

> It would probably be better to unwrap our `bookConfig$` once in our template, but I wanted to keep each of these as seperate units.

For our book component we are once again going to get all of the age categories from our Config Book in Firestore and use those values for our select.

![Mat Select](https://res.cloudinary.com/ajonp/image/upload/f_auto,fl_lossy,q_auto/v1548967697/ajonp-ajonp-com/11-lesson-angular-navigation-firestore/rxghw62n7jkgwdilxh80.jpg)

book-edit.component.html

```html
<section>
  <mat-form-field style="width: 100%">
    <mat-select placeholder="Age Category">
      <mat-option
        *ngFor="let ageCategory of (bookConfig$ | async)?.ageCategory"
        [value]="ageCategory"
      >
        {{ ageCategory }}
      </mat-option>
    </mat-select>
  </mat-form-field>
</section>
```

### Slider

![Slider](https://res.cloudinary.com/ajonp/image/upload/f_auto,fl_lossy,q_auto/v1548967734/ajonp-ajonp-com/11-lesson-angular-navigation-firestore/j0hmgry94kxytkpaws0a.jpg)

- [Slider](https://material.angular.io/components/slider/overview) `<mat-slider>` allows for the selection of a value from a range via mouse, touch, or keyboard, similar to `<input type="range">`.

book-edit.module.ts

```ts
  imports: [
    ...
       MatSliderModule,
```

We once again will not be doing anything with this value, but I did want to show you how to default the value on creation. Later we will tie this directly to the Firestore value for our book.

book-edit.component.ts

```ts
bookRating = 3;
```

book-edit.component.html

```html
<section>
  <h3>Rating</h3>
  <mat-slider
    min="1"
    max="5"
    step="0.5"
    value="1.5"
    [(ngModel)]="bookRating"
  ></mat-slider>
</section>
```

### Radio button

![Radio Button](https://res.cloudinary.com/ajonp/image/upload/f_auto,fl_lossy,q_auto/v1548968040/ajonp-ajonp-com/11-lesson-angular-navigation-firestore/edkb9mkpmr46tkfjthr4.jpg)

- [Radio button](https://material.angular.io/components/radio/overview) `<mat-radio-button>` provides the same functionality as a native `<input type="radio">` enhanced with Material Design styling and animations.

book-edit.module.ts

```ts
  imports: [
    ...
       MatRadioModule,
```

For us this will again in the future refer directly to a status on our Book, we could create these from a Firestore config, but I don't see us changing these options very often. If you want you could do the same loop as we did with the select option and add the config. In the next lesson we will add that config and show how to do a validation of sorts.

book-edit-component.html

```html
<section>
  <h3>Status</h3>
  <mat-radio-group [(ngModel)]="bookStatus" fxLayout="column">
    <mat-radio-button value="Draft">Draft</mat-radio-button>
    <mat-radio-button value="Published">Published</mat-radio-button>
  </mat-radio-group>
</section>
```

# Wrap Up

Here we have created all of the Angular Material Form Components, many of them with data being pulled from Firestore. Next is to make our form more Reactive.

![Kitchen Sink](https://res.cloudinary.com/ajonp/image/upload/f_auto,fl_lossy,q_auto/v1548968315/ajonp-ajonp-com/11-lesson-angular-navigation-firestore/dwg3vmpnxdsam560rvhr.jpg)
