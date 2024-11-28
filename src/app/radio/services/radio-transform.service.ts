import { Injectable } from '@angular/core';
import { BlankStep, Brand, BrandDTO, DiffusionStep, Live, SongDTO, Step, StepEnum, TrackStep } from '../models/radioFrance.interface';

@Injectable({
  providedIn: 'root'
})
export class RadioTransformService {

  constructor() { }

  public factory(data: Live): SongDTO | undefined {
    if (data.live.song) {
      return this.checkInstance(data.live.song);
    } else if (data.live.program) {
      return this.checkInstance(data.live.program);
    } else if (data.live.show) {
      return this.checkInstance(data.live.show);
    } else {
      return undefined;
    }
  }

  public checkInstance(step: Step): SongDTO {
    if (step.__typename === StepEnum.TrackStep) {
      return this.trackStepToPlayer(step as TrackStep);
    } else if (step.__typename === StepEnum.DiffusionStep) {
      return this.diffusionStepToPlayer(step as DiffusionStep);
    } else if (step.__typename === StepEnum.BlankStep) {
      return this.blanckStepToPlayer(step as BlankStep);
    } else {
      return this.trackStepToPlayer(step as TrackStep);
    }
  }

  private diffusionStepToPlayer(step: DiffusionStep): SongDTO {
    return {
      title: step.diffusion?.title,
      artist: step.diffusion?.standFirst,
      start: step.start,
      end: step.end,
    }
  }

  private blanckStepToPlayer(step: BlankStep): SongDTO {
    return {
      title: step.title,
      artist: null,
      start: step.start,
      end: step.end,
    }
  }

  private trackStepToPlayer(step: TrackStep): SongDTO {
    return {
      title: step.track.title,
      artist: step.track.performers.join(' & '),
      start: step.start,
      end: step.end,
    }
  }

  public gridMapper(grid: TrackStep[] | BlankStep[] | DiffusionStep[]): SongDTO[] {
    let songs: SongDTO[] = [];
    grid.forEach((song: TrackStep | BlankStep | DiffusionStep) => songs.push(this.checkInstance(song)));
    return songs.slice(0,10).reverse();
  }

  public brandMapper(brand: Brand): BrandDTO {
    return {
      value: brand.brand.liveStream,
      viewValue: brand.brand.title,
    }
  }


}
