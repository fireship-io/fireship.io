import { Component, ElementRef, AfterViewInit, ViewEncapsulation, Inject, HostListener, ChangeDetectorRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SetState } from '../state.decorator';
import { LOCAL_STORAGE } from '../local-storage.service';


export type Theme = 'dark-theme' | 'light-theme' | 'colorful-theme';


@Component({
  templateUrl: './theme-btn.component.html',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ThemeBtnComponent implements AfterViewInit {
  private readonly themeKey = 'theme';

  themeMap: {[key in Theme]: Theme} = {
    'dark-theme': 'light-theme',
    'light-theme': 'colorful-theme',
    'colorful-theme': 'dark-theme'
  };

  theme: Theme;

  constructor(
    private el: ElementRef,
    private cd: ChangeDetectorRef,
    @Inject(LOCAL_STORAGE) private localStorage: Storage,
    @Inject(DOCUMENT) private document: Document) {
      this.theme = this.getIt();
  }

  @HostListener('document:DOMContentLoaded')
  domContentLoaded() {
    this.changeTheme(this.theme);
  }

  ngAfterViewInit() {
    this.el.nativeElement.style.visibility = 'visible';
  }

  @SetState()
  changeTheme(next?: Theme) {
    const prev = this.theme;
    next = next || this.themeMap[prev];
    this.theme = next;
    this.document.body.className = next;
    this.storeIt(next);
  }

  getIt(): Theme {
    const theme = this.localStorage.getItem(this.themeKey);
    if (theme in Object.keys(this.themeMap)) {
      return theme as Theme;
    } else {
      return 'dark-theme';
    }
  }

  storeIt(next: Theme) {
    this.localStorage.setItem(this.themeKey, next);
  }
}
