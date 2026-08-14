import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

declare const YT: any;

export enum PlayerState {
  Unstarted = -1,
  Ended = 0,
  Playing = 1,
  Paused = 2,
  Buffering = 3,
  Cued = 5
}

@Injectable({
  providedIn: 'root'
})
export class YoutubePlayerService {
  private readonly apiReadySubject = new ReplaySubject<void>(1);
  public readonly apiReady$ = this.apiReadySubject.asObservable();
  private readonly stateChangeSubject = new Subject<PlayerState>();
  public readonly stateChange$ = this.stateChangeSubject.asObservable();

  constructor() {
    this.loadApi();
  }

  private loadApi(): void {
    if ((window as any).YT?.Player) {
      this.apiReadySubject.next();
      return;
    }

    if (document.getElementById('youtube-iframe-api')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'youtube-iframe-api';
    script.src = 'https://www.youtube.com/iframe_api';

    (window as any).onYouTubeIframeAPIReady = () => {
      this.apiReadySubject.next();
    };

    document.body.appendChild(script);
  }

  createPlayer(elementId: string, videoId: string, onEnded: () => void): any {
    return new YT.Player(elementId, {
      videoId,
      width: '100%',
      height: '100%',
      events: {
        onStateChange: (event: any) => {
          this.stateChangeSubject.next(event.data);

          if (event.data === YT.PlayerState.ENDED) {
            onEnded();
          }
        }
      }
    });
  }
}
