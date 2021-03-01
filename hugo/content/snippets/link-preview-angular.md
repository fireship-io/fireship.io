---
title: Link Preview Angular
lastmod: 2019-07-23T10:43:06-07:00
publishdate: 2019-07-23T10:43:06-07:00
author: Jeff Delaney
draft: false
description: Build a Link Preview Component with Ionic Angular
type: lessons
# pro: true
tags: 
    - angular
    - ionic
    - cloud-functions

vimeo: 
github: https://github.com/fireship-io/198-web-scraper-link-preview
# youtube: 
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3

# chapters:

---

👀 This tutorial is an extension of the [Web Scraping Guide](/lessons/web-scraping-guide/). You must have the HTTP Cloud Function running locally or deployed to production to fetch link data from third-party websites.  


## Link Preview Component

The component below demonstrates a basic **link preview** implementation in Angular (Ionic 4). Submitting the form with URLs included in the text will be rendered in page with a title, image, and description based on the site's metatags.

{{< figure src="/img/snippets/ionic-link-preview.png" alt="Link preview result in Ionic Angular" >}}

The component TypeScript uses [Angular's HTTP Client](https://angular.io/guide/http) to subscribe to the function endpoint, passing it the text from the form. 

{{< file "ngts" "home.component.ts" >}}
{{< highlight typescript >}}
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  links;
  loading = false;
  text = '';

  constructor(private http: HttpClient) {}

  handleSubmit(evt) {
    evt.preventDefault();

    this.loading = true;

    this.http.post(
      'http://localhost:5000/fireship-lessons/us-central1/scraper',
      JSON.stringify({ text: this.text })
    )
    .subscribe(res => {
      this.links = res;
      this.loading = false;
    });


  }

  handleChange(evt) {
    this.text = evt.target.value;
  }

}

{{< /highlight >}}

The template loops have the links after they are returned from the HTTP function. We use Ionic components to provide a nice UI out of the box. 


{{< file "html" "home.component.html" >}}
{{< highlight html >}}
<ion-content>
    <h1>Form</h1>
    <!-- Try this: <pre>get some https://fireship.io and https://fireship.io/courses/javascript/</pre> -->
  <form (submit)="handleSubmit($event)">
    <ion-label position="floating">Text</ion-label>
    <ion-textarea (keyup)="handleChange($event)"></ion-textarea>

    <ion-button type="submit">Submit</ion-button>
  </form>

  {{ text }} 
  <hr>
  <h3>{{ loading ? 'Loading...  🤔🤔🤔' : '' }}</h3>

  <a class="preview" *ngFor="let linkData of links" [href]="linkData.url">
    <img [src]="linkData.image" />
    <div>
      <h4>{{linkData.title}}</h4>
      <p>{{linkData.description}}</p>
    </div>
  </a>
</ion-content>
{{< /highlight >}}