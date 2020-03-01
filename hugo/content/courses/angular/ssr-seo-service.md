---
title: SEO Service
description: Create a service for Open Graph & Twitter meta tags. 
weight: 51
lastmod: 2019-07-16T10:23:30-09:00
draft: false
vimeo: 359182030
emoji: 🏷️
video_length: 5:32
---

Create a customers module that uses dynamic routing and generates SEO metatags based on a Firestore document query. 

## Steps 

### Generate Resources

{{< file "terminal" "command line" >}}
{{< highlight text >}}
ng g module customers --routing

ng g c customers/detail-page
ng g c customers/list-page

ng g s services/seo
{{< /highlight >}}

### Routing

{{< file "ngts" "customers-routing.module.ts" >}}
{{< highlight typescript >}}
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListPageComponent } from './list-page/list-page.component';
import { DetailPageComponent } from './detail-page/detail-page.component';


const routes: Routes = [
  { path: '', component: ListPageComponent },
  { path: ':id', component: DetailPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
{{< /highlight >}}

### SEO Service

{{< file "ngts" "seo.service.ts" >}}
{{< highlight typescript >}}
import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(private title: Title, private meta: Meta, private router: Router) { }

  generateTags({ title = '', description = '', image = '' }) {

    this.title.setTitle(title);
    this.meta.addTags([
      // Open Graph
      { name: 'og:url', content: `https://firestarter.fireship.io${this.router.url}` },
      { name: 'og:title', content: title },
      { name: 'og:description', content: description },
      { name: 'og:image', content: image },
      // Twitter Card
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:site', content: '@fireship_dev' },
    ]);
  }
}
{{< /highlight >}}

### List Page

{{< file "ngts" "list-page.component.ts" >}}
{{< highlight typescript >}}
import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss']
})
export class ListPageComponent implements OnInit {
  customers;

  constructor(private seo: SeoService, private db: AngularFirestore) {}

  ngOnInit() {
    this.seo.generateTags({
      title: 'Customer List',
      description: 'A list filled with customers'
    });

    this.customers = this.db.collection('customers').valueChanges({ idField: 'id' });

  }
}

{{< /highlight >}}

{{< file "html" "list-page.component.html" >}}
{{< highlight html >}}
<mat-list-item *ngFor="let cust of customers | async" [routerLink]="cust.id" role="listitem">
    <h3>{{ cust.name }}</h3>
</mat-list-item>
{{< /highlight >}}

### Detail Page

{{< file "ngts" "detail-page.component.ts" >}}
{{< highlight typescript >}}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { tap } from 'rxjs/operators';
import { SeoService } from 'src/app/services/seo.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss']
})
export class DetailPageComponent implements OnInit {
  customerId: string;
  customer: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private seo: SeoService
  ) {}

  ngOnInit() {
    this.customerId = this.route.snapshot.paramMap.get('id');

    this.customer = this.db
      .collection('customers')
      .doc<any>(this.customerId)
      .valueChanges()
      .pipe(
        tap(cust =>
          this.seo.generateTags({
            title: cust.name,
            description: cust.bio,
            image: cust.image,
          })
        )
      );
  }
}
{{< /highlight >}}


