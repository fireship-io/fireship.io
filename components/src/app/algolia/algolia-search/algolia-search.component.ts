import { Component, ChangeDetectorRef, ElementRef, AfterViewInit, Input } from '@angular/core';
import * as algolia from 'algoliasearch/lite';

const APP_ID = '05VYZFXKNM';
const API_KEY = 'a0837b31f4379765240c2753fa141aa2';
const client = algolia(APP_ID, API_KEY);

@Component({
  templateUrl: './algolia-search.component.html'
})
export class AlgoliaSearchComponent implements AfterViewInit  {

  index = client.initIndex('content');

  emojiMap = {
    lessons: '📺',
    courses: '🎒',
    tags: '🔖',
    contributors: '🤓',
    snippets: '✂️',
    page: '📃'
  };

  visible = false;

  query: string;
  hits: any[];
  results: any;

  constructor(private cd: ChangeDetectorRef, private el: ElementRef) { }

  // Public toggles
  @Input() show = () => this.toggle(true);
  @Input() hide = () => this.toggle(false);

  ngAfterViewInit() {

  }

  toggle(val) {
    this.visible = val;
    this.cd.detectChanges();
  }

  handleSearch(query) {
    this.query = query;
    this.index.search({ query }, (err, res) => {
      this.results = res;
      this.hits = res.hits;
      this.cd.detectChanges();
    }
    );
    this.cd.detectChanges();
  }


}
