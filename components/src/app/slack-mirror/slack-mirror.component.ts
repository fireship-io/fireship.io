import { Component, ChangeDetectorRef, AfterViewInit, OnDestroy, Input } from '@angular/core';

import { collectionData } from 'rxfire/firestore';
import { tap } from 'rxjs/operators';
import { slackdown } from './slackdown';
import { SetState } from '../state.decorator';
import { getFirestore, collection, where, query } from 'firebase/firestore';

@Component({
  templateUrl: './slack-mirror.component.html',
})
export class SlackMirrorComponent implements AfterViewInit, OnDestroy {
  @Input() permalink;

  firestore = getFirestore();

  activeThread: string;
  threads: any[];
  sub;

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterViewInit() {
    const ref = collection(this.firestore, 'slack');
    const q1 = where('permalink', '==', this.fullUrl);
    const q2 = where('visible', '==', true);
    const colQuery = query(ref, q1, q2);

    this.sub = collectionData(colQuery, {idField: 'slackID'})
      .pipe(
        tap((data) => {
          this.activeThread = data[0] && (data[0] as any).slackID;
          this.setState('threads', data);
        })
      )
      .subscribe();
  }

  @SetState()
  setState(k, v) {
    this[k] = v;
  }

  showReplies(slackID) {
    this.setState('activeThread', slackID);
  }

  async copyCmd() {
    try {
      await (window.navigator as any).clipboard.writeText(this.qLink);
    } catch (err) {
      console.log('no clipboard support');
    }

    window.open('https://slack.com/app_redirect?channel=CF6J9G59S');
  }

  repliesLen(thread) {
    return thread.replies ? Object.keys(thread.replies).length : 0;
  }

  get fullUrl() {
    return 'https://fireship.io' + this.permalink;
  }

  get qLink() {
    // return `@question ${this.fullUrl} [Insert Your Question]`;
    return `@Question ${this.fullUrl} your question...?`;
  }

  asHtml(val: string) {
    // TODO cleanup
    if (val.includes('/>')) {
      const segments = val.split('/>');
      segments.shift();
      const clean = segments.join('');
      return slackdown(clean);
    } else {
      return slackdown(val);
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
