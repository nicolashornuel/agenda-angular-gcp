import {Component, TemplateRef} from '@angular/core';
import {AlertService} from '@shared/services/alert.service';
import {ModalService, Modal, ModalParam} from '@shared/services/modal.service';
import {Observable, lastValueFrom, map, take, takeUntil} from 'rxjs';
import {VideoGAPI} from '../models/videoGAPI.interface';
import {VideoService} from '../services/video.service';
import {DestroyService} from '@shared/services/destroy.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({template: ''})
export abstract class VideoController {

  constructor(
    private videoService: VideoService,
    private alertService: AlertService,
    private modalService: ModalService,
    private destroy$: DestroyService,
    private _sanitizer: DomSanitizer
  ) {}

  getVideos(): Observable<VideoGAPI[]> {
    return this.videoService.findAll().pipe(takeUntil(this.destroy$));
  }

  getCategories(): Promise<Set<string>> {
    return lastValueFrom(
      this.videoService.findAll().pipe(
        take(1),
        map((videos: VideoGAPI[]) => new Set(videos.map(video => video.categorie)))
      )
    );
  }

  updateVideo(video: VideoGAPI): void {
    this.videoService
      .updateVideo(video)
      .pipe(take(1))
      .subscribe(id => {
        this.alertService.success(`${video.title} modifié id:${id}`);
      });
  }

  addVideo(video: VideoGAPI): void {
    this.videoService
      .addVideo(video)
      .pipe(take(1))
      .subscribe(id => {
        this.alertService.success(`${video.title} ajouté id:${id}`);
      });
  }


  deleteVideo(video: VideoGAPI): void {
    this.videoService
      .deleteVideo(video)
      .pipe(take(1))
      .subscribe(id => {
        this.alertService.success(`${video.title} supprimé id:${id}`);
      });
  }

  openModal(video: VideoGAPI, templateRef: TemplateRef<Modal>): void {
    const modalParam: ModalParam = {
      title: `${video.channelTitle} (${video.publishedAt})`,
      context: {$implicit: video},
      template: templateRef
    };
    this.modalService.set$(modalParam);
  }

  sanitizeUrl(src: string): SafeResourceUrl {
    return this._sanitizer.bypassSecurityTrustResourceUrl(src);
  }
  
}
