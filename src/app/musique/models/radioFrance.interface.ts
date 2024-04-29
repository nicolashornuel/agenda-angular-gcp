export enum StepEnum {
  DiffusionStep = 'DiffusionStep',
  BlankStep = 'BlankStep',
  TrackStep = 'TrackStep'
}
export interface Live {
  live: {
    show: TrackStep | BlankStep | DiffusionStep;
    program: TrackStep | BlankStep | DiffusionStep;
    song: TrackStep;
  };
}
export interface Step {
  id: string;
  start: number;
  end: number;
  __typename: string;
}
export interface TrackStep extends Step  {
  id: string;
  start: number;
  end: number;
  __typename: string;
  track: {
    id: string;
    title: string;
    albumTitle: string;
    label: string;
    mainArtists: string[];
    authors: string[];
    composers: string[];
    performers: string[];
    productionDate: number;
    discNumber: number;
    trackNumber: number;
  }
}
export interface BlankStep extends Step  {
  id: string;
  start: number;
  end: number;
  __typename: string;
  title: string;
  children: [TrackStep | BlankStep | DiffusionStep];
}
export interface DiffusionStep extends Step {
  id: string;
  start: number;
  end: number;
  __typename: string;
  children: TrackStep[] | BlankStep[] | DiffusionStep[];
  diffusion: {
    id: string;
    title: string;
    standFirst: string;
    url: string;
    published_date: string;
    isStreamable: Boolean;
    show: {
      id: string;
      title: string;
      url: string;
      standFirst: string;
      podcast: {
        rss: string;
        itunes: string;
      };
    };
  };
}
export interface Brand {
  brand: {
    id: string;
    title: string;
    baseline: string;
    description: string;
    websiteUrl: string;
    liveStream: string;
    localRadios: [
      {
        id: string;
        title: string;
        description: string;
        liveStream: string;
      }
    ];
    webRadios: [
      {
        id: string;
        title: string;
        description: string;
        liveStream: string;
      }
    ];
  };
}
export interface Grid {
  grid: TrackStep[] | BlankStep[] | DiffusionStep[];
}
export interface SongDTO {
  title: string;
  artist: string | null;
  start: number;
  end: number;
}
export interface BrandDTO {
  value: string;
  viewValue: string;
}

