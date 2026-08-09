import { inject, Injectable } from '@angular/core';
import { PlayerStateService } from 'app/left-bar/services/left-bar.observable.service';
import { Observable, ReplaySubject } from 'rxjs';

declare const YT: any;

@Injectable({
  providedIn: 'root'
})
export class YoutubePlayerService {
  private readonly apiReadySubject = new ReplaySubject<void>(1);
  public readonly apiReady$ = this.apiReadySubject.asObservable();
  private playerStateService = inject(PlayerStateService);

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
      playerVars: {
        autoplay: 1
      },
      events: {
        onStateChange: (event: any) => {

          this.playerStateService.set$(event.data);

          if (event.data === YT.PlayerState.ENDED) {
            onEnded();
          }
        }
      }
    });
  }

/*   public createPlayer(elementId: string, videoId: string, onEnded: () => void): Observable<any> {
    return new Observable(observer => {
      const player = new YT.Player(elementId, {
        videoId,
        playerVars: {
          autoplay: 1
        },
        events: {
          onReady: () => {
            observer.next(player);
            observer.complete();
          },

          onStateChange: (event: any) => {
            this.playerStateService.set$(event.data);
            if (event.data === YT.PlayerState.ENDED)
              onEnded();
          }
        }
      });

      return () => {
        player.destroy();
      };
    });
  } */
}
