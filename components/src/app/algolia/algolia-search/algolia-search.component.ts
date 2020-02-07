import { Component, ChangeDetectorRef, ElementRef, Input, HostListener, ViewChild } from '@angular/core';
import algolia from 'algoliasearch/lite';


const APP_ID = '05VYZFXKNM';
const API_KEY = 'a0837b31f4379765240c2753fa141aa2';
const client = algolia(APP_ID, API_KEY);

@Component({
  templateUrl: './algolia-search.component.html'
})
export class AlgoliaSearchComponent {

  constructor(private cd: ChangeDetectorRef, private el: ElementRef) {}

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

  @ViewChild('searchInput') searchInput: ElementRef;

  // Public toggles
  @Input() show = () => this.toggle(true);
  @Input() hide = () => this.toggle(false);

  @HostListener('document:keydown', ['$event'])
  keyDownHandler(e: KeyboardEvent) {
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyP') {
      // Ctrl + Shift + P shortcut to open the search box
      e.preventDefault();
      this.toggle(true);
    } else if (e.code === 'Escape') {
      // ESC to close the search box
      this.toggle(false);
    }
  }

  toggle(val) {
    this.visible = val;
    // Focus the input element
    this.searchInput.nativeElement.focus();
    this.cd.detectChanges();
  }

  async handleSearch(query: string) {
    this.query = query;
    this.results = await this.index.search(query);

    this.hits = this.results.hits;

    this.cd.detectChanges();
  }


}
