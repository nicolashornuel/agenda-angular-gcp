import {DOCUMENT} from '@angular/common';
import {Inject, Injectable, Renderer2, RendererFactory2} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScriptService {
  private renderer: Renderer2;

  constructor(@Inject(DOCUMENT) private document: Document, private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public loadJsScript(src: string): HTMLScriptElement {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    this.renderer.appendChild(this.document.body, script);
    return script;
  }

  public loadJsScriptEmbed(scriptElt: any): HTMLScriptElement {
    let script: HTMLScriptElement = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptElt.src;
    script.async = true;
    script.text = JSON.stringify(scriptElt.text);
    this.renderer.appendChild(scriptElt.parentElt.nativeElement, script);
    script.onload = () => {
      console.log(`${scriptElt.name} Script loaded`);
    };
    script.onerror = () => {
      console.log(`Could not load ${scriptElt.name} Script!`);
    };
    return script;
  }

  // https://developers.google.com/youtube/player_parameters?hl=fr
  public loadYoutubeScript(videoId: string): HTMLScriptElement {
    let script: HTMLScriptElement = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.youtube.com/player_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode!.insertBefore(script, firstScriptTag);
    (<any>window).onYouTubeIframeAPIReady = () => {
      const player = new (<any>window).YT.Player('player', {
        videoId: videoId,
        events: {
          'onReady': () => {},
          'onStateChange': () => {},
        },
        playerVars: {
          autoplay: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          showInfo: 0
        }
      });
    };

    return script;
  }
}
