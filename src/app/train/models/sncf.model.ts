import { Selectable } from "@shared/models/fieldSet.model";

export interface NavitiaResponse {
  pagination: {
    total_result: number,
    start_page: number,
    items_per_page: number,
    items_on_page: number
  },
  disruptions: Disruption[];
  exceptions: any[];
  departures?: Journey[];
  arrivals?: Journey[];
  terminus_schedules?: Schedule[];
  stop_schedules?: Schedule[];
  vehicle_journeys: { stop_times: { stop_point: Stop_point }[] }[];
}

export interface Schedule {
  date_times: {date_time: string, base_date_time: string, links: {id: string, type: string}[]}[];
  display_informations: { headsign: string; network: string; direction: string;};
  route: {id: string, line: {id: string, network: {id: string}}};
}

export interface ScheduleDTO {
  headsign: string; 
  network: string; 
  direction: string;
  date_times: {baseHour: string, trajetId: string}[];
  routeId: string;
  lineId: string;
  networkId: string;
}

export interface Disruption {
  messages: { text: string }[];
  severity: { effect: string; name: string };
  status: string;
  impacted_objects: {
    impacted_stops: {
      amended_arrival_time: string;
      amended_departure_time: string;
      arrival_status: string;
      base_arrival_time: string;
      base_departure_time: string;
      cause: string;
      is_detour: boolean;
      departure_status: string;
      stop_point: Stop_point;
    }[];
  }[];
}

export interface DisruptionDTO {
  status: string,
  message: string,
  severityEffect: string,
  severityName: string
}

export interface Stop_point {
  id: string; 
  name: string;
}

export interface Link {
  id: string;
  type: string;
}

export interface Journey {
  display_informations: { headsign: string; network: string; direction: string; links: Link[] };
  links: Link[];
  stop_date_time: {
    arrival_date_time: string;
    base_arrival_date_time: string;
    base_departure_date_time: string;
    departure_date_time: string;
  };
  stop_point: Stop_point;
}

export interface JourneyDTO {
  disruptionId?: string;
  headsign: string;
  network: string;
  direction: string;
  trajetId: string;
  baseHour: string;
  delay: string;
}

// https://api.sncf.com/v1/coverage/sncf/places?q=avignon
// liste des gares :https://ressources.data.sncf.com/explore/dataset/liste-des-gares/table/
export enum StopAreaEnum {
  BAILLARGUES = 'Baillargues',
  BOURG_EN_BRESSE = 'Bourg-en-Bresse',
  MONTPELLIER_SAINT_ROCK = 'Montpellier Saint-Roch',
  MONTPELLIER_SUD_DE_FRANCE = 'Montpellier Sud de France',
  NIMES_CENTRE = 'Nîmes Centre',
  NIMES_PONT_DU_GARD = 'Nîmes Pont-du-Gard',
  LYON_PART_DIEU = 'Lyon Part Dieu',
  AVIGNON_CENTRE = 'Avignon Centre',
  AVIGNON_TGV = 'Avignon TGV',
  MARSEILLE_SAINT_CHARLES = 'Marseille Saint-Charles',
  MACON_LOCHE_TGV = 'Mâcon Loché TGV',
  MACON = 'Mâcon'
}
export class StopArea implements Selectable<string> {
  value!: string;
  name!: StopAreaEnum;

  public static readonly BAILLARGUES = {
    value: 'stop_area:SNCF:87773457',
    name: StopAreaEnum.BAILLARGUES
  };
  public static readonly BOURG_EN_BRESSE = {
    value: "stop_area:SNCF:87743005",
    name: StopAreaEnum.BOURG_EN_BRESSE
  };
  public static readonly MONTPELLIER_SAINT_ROCK = {
    value: 'stop_area:SNCF:87773002',
    name: StopAreaEnum.MONTPELLIER_SAINT_ROCK
  };
  public static readonly MONTPELLIER_SUD_DE_FRANCE = {
    value: 'stop_area:SNCF:87688887',
    name: StopAreaEnum.MONTPELLIER_SUD_DE_FRANCE
  };
  public static readonly NIMES_CENTRE = {
    value: 'stop_area:SNCF:87775007',
    name: StopAreaEnum.NIMES_CENTRE
  };
  public static readonly NIMES_PONT_DU_GARD = {
    value: 'stop_area:SNCF:87703975',
    name: StopAreaEnum.NIMES_PONT_DU_GARD
  };
  public static readonly LYON_PART_DIEU = {
    value: 'stop_area:SNCF:87723197',
    name: StopAreaEnum.LYON_PART_DIEU
  };
  public static readonly AVIGNON_CENTRE = {
    value: 'stop_area:SNCF:87765008',
    name: StopAreaEnum.AVIGNON_CENTRE
  };
  public static readonly AVIGNON_TGV = {
    value: 'stop_area:SNCF:87318964',
    name: StopAreaEnum.AVIGNON_TGV
  };
  public static readonly MARSEILLE_SAINT_CHARLES = {
    value: 'stop_area:SNCF:87751008',
    name: StopAreaEnum.MARSEILLE_SAINT_CHARLES
  };
  public static readonly MACON_LOCHE_TGV = {
    value: 'stop_area:SNCF:87725705',
    name: StopAreaEnum.MACON_LOCHE_TGV
  };
  public static readonly MACON = {
    value: 'stop_area:SNCF:87725689',
    name: StopAreaEnum.MACON
  };
}
export const STATIONS = [
  {
    value: 'stop_area:SNCF:87773457',
    name: StopAreaEnum.BAILLARGUES
  },
  {
    value: 'stop_area:SNCF:87773002',
    name: StopAreaEnum.MONTPELLIER_SAINT_ROCK
  },
  {
    value: 'stop_area:SNCF:87688887',
    name: StopAreaEnum.MONTPELLIER_SUD_DE_FRANCE
  },
  {
    value: 'stop_area:SNCF:87775007',
    name: StopAreaEnum.NIMES_CENTRE
  },
  {
    value: 'stop_area:SNCF:87703975',
    name: StopAreaEnum.NIMES_PONT_DU_GARD
  },
  {
    value: 'stop_area:SNCF:87723197',
    name: StopAreaEnum.LYON_PART_DIEU
  },
  {
    value: 'stop_area:SNCF:87765008',
    name: StopAreaEnum.AVIGNON_CENTRE
  },
  {
    value: 'stop_area:SNCF:87318964',
    name: StopAreaEnum.AVIGNON_TGV
  },
  {
    value: 'stop_area:SNCF:87751008',
    name: StopAreaEnum.MARSEILLE_SAINT_CHARLES
  },
  {
    value: 'stop_area:SNCF:87725705',
    name: StopAreaEnum.MACON_LOCHE_TGV
  },
  {
    value: 'stop_area:SNCF:87725689',
    name: StopAreaEnum.MACON
  }
];
