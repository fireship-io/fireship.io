import {
  Component,
  ChangeDetectorRef,
  Input,
  ViewChild,
  ViewEncapsulation,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { AuthService } from '../users/auth.service';

import Plyr from 'plyr';
import { tap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class VideoPlayerComponent implements AfterViewInit, OnDestroy {
  @Input() src;
  @Input() youtube;
  @Input() poster;
  @Input() requireLogin;
  @Input() config = '{ "enabled": true }';

  @ViewChild('player') playerRef: ElementRef;
  player;

  userSub;

  private readonly params = new URLSearchParams({
    origin: 'https://plyr.io',
    iv_load_policy: '3',
    modestbranding: '1',
    playsinline: '1',
    showinfo: '0',
    rel: '0',
    enablejsapi: '1'
  });

  constructor(
    private cd: ChangeDetectorRef,
    public auth: AuthService,
    private el: ElementRef,
    private san: DomSanitizer
  ) {}

  get trusted() {
      return this.san.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.youtube}?${this.params}`);
  }

  get canWatch() {
      return !!(!this.requireLogin || (this.requireLogin && this.auth.user));
  }

  ngAfterViewInit() {

    if (this.requireLogin) {
      this.userSub = this.auth.user$
        .pipe(
          tap(user => {
            if (user) {
                this.setupPlayer();
                this.cd.detectChanges();
            }
          })
        )
        .subscribe();
    } else {
        this.setupPlayer();
    }
  }


  setupPlayer() {
    const el = this.playerRef.nativeElement;
    this.player = new Plyr(el, this.getSettings());
  }

  getSettings(obj?) {
    const defaults = {
      loadSprite: false,
      settings: ['quality', 'speed'],
      speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] }
    };
    return { ...defaults, ...JSON.parse(this.config), ...obj };
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.player) {
      this.player.destroy();
    }
  }
}
