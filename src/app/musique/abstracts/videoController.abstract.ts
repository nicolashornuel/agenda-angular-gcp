import { Component, TemplateRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AlertService } from '@shared/services/alert.service';
import { DestroyService } from '@shared/services/destroy.service';
import { Modal, ModalParam, ModalService } from '@shared/services/modal.service';
import { Observable, map, takeUntil } from 'rxjs';
import { VideoGAPI } from '../models/videoGAPI.interface';
import { VideoService } from '../services/musique.firestore.service';

@Component({template: ''})
export abstract class VideoController {

  constructor(
    public videoService: VideoService,
    private alertService: AlertService,
    private modalService: ModalService,
    public destroy$: DestroyService,
    private _sanitizer: DomSanitizer
  ) {}

  getVideos(): Observable<VideoGAPI[]> {
    return this.videoService.getAll().pipe(takeUntil(this.destroy$));
  }

  getCategories(): Observable<Set<string>> {
    return this.videoService.getAll().pipe(
      takeUntil(this.destroy$),
      map((videos: VideoGAPI[]) => new Set(videos.map(video => video.categorie)))
    );
  }

  async updateVideo(video: VideoGAPI): Promise<void> {
    video.updatedAt = new Date().toJSON();
    await this.videoService.update(video, video.id);
    this.alertService.success(`${video.title} modifié id:${video.id}`);
  }

  async addVideo(video: VideoGAPI): Promise<void> {
    video.addedAt = new Date().toJSON();
    video.id = await this.videoService.save(video);
    this.alertService.success(`${video.title} ajouté id:${video.id}`);
  }

  async deleteVideo(video: VideoGAPI): Promise<void> {
    await this.videoService.delete(video.id);
    this.alertService.success(`${video.title} supprimé id:${video.id}`);
  }

  openModal(video: VideoGAPI, templateRef: TemplateRef<Modal>): void {
    const modalParam: ModalParam = {
      title: `${video.channelTitle} (${video.publishedAt})`,
      context: {$implicit: video},
      template: templateRef
    };
    this.modalService.set$(modalParam);
  }

  closeModal(): void {
    this.modalService.set$(undefined);
  }

  sanitizeUrl(src: string): SafeResourceUrl {
    return this._sanitizer.bypassSecurityTrustResourceUrl(src);
  }
}
