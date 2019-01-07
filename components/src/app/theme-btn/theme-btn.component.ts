import { Component, ElementRef, ChangeDetectorRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { SetState } from '../state.decorator';

@Component({
  templateUrl: './theme-btn.component.html',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ThemeBtnComponent implements AfterViewInit {

  themeMap = {
    'dark-theme': 'light-theme',
    'light-theme': 'colorful-theme',
    'colorful-theme': 'dark-theme'
  };

  theme: string;

  constructor(private cd: ChangeDetectorRef, private el: ElementRef) {
    this.theme = this.getIt();
  }

  ngAfterViewInit() {
    this.el.nativeElement.style.visibility = 'visible';
    document.addEventListener('DOMContentLoaded', e => this.changeTheme(this.theme));
  }

  @SetState()
  changeTheme(next?) {
    const prev = this.theme;
    next = next || this.themeMap[prev];
    this.theme = next;
    document.body.className = next;
    this.storeIt(next);
  }

  getIt() {
    const theme = localStorage && localStorage.getItem('theme');
    if (!Object.keys(this.themeMap).includes(theme)) {
      return 'dark-theme';
    } else {
      return theme;
    }
  }

  storeIt(next) {
    if (localStorage) {
      localStorage.setItem('theme', next);
    }
  }
}
