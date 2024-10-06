export enum StationsEnum {
  FIP = 'FIP',
  FIP_ELECTRO = 'FIP_ELECTRO',
  FIP_GROOVE = 'FIP_GROOVE',
  FIP_JAZZ = 'FIP_JAZZ',
  FIP_METAL = 'FIP_METAL',
  FIP_NOUVEAUTES = 'FIP_NOUVEAUTES',
  FIP_POP = 'FIP_POP',
  FIP_HIP_HOP = 'FIP_HIP_HOP',
  FIP_REGGAE = 'FIP_REGGAE',
  FIP_ROCK = 'FIP_ROCK',
  FIP_WORLD = 'FIP_WORLD',
  Bassdrive = 'Bassdrive'
}

const PREFIX = 'https://icecast.radiofrance.fr/fip';
const SUFFIX = '-midfi.mp3?id=openapi';

export interface StationSelectable {
  id: StationsEnum;
  name: string;
  value: String;
}
export const Stations: StationSelectable[] = [
  { id: StationsEnum.FIP, name: 'FIP', value: `${PREFIX}${SUFFIX}` },
  { id: StationsEnum.FIP_ELECTRO, name: 'FIP_ELECTRO', value: `${PREFIX}electro${SUFFIX}` },
  { id: StationsEnum.FIP_GROOVE, name: 'FIP_GROOVE', value: `${PREFIX}groove${SUFFIX}` },
  { id: StationsEnum.FIP_JAZZ, name: 'FIP_JAZZ', value: `${PREFIX}jazz${SUFFIX}` },
  { id: StationsEnum.FIP_METAL, name: 'FIP_METAL', value: `${PREFIX}metal${SUFFIX}` },
  { id: StationsEnum.FIP_NOUVEAUTES, name: 'FIP_NOUVEAUTES', value: `${PREFIX}nouveautes${SUFFIX}` },
  { id: StationsEnum.FIP_POP, name: 'FIP_POP', value: `${PREFIX}pop${SUFFIX}` },
  { id: StationsEnum.FIP_HIP_HOP, name: 'FIP_HIP_HOP', value: `${PREFIX}hiphop${SUFFIX}` },
  { id: StationsEnum.FIP_REGGAE, name: 'FIP_REGGAE', value: `${PREFIX}reggae${SUFFIX}` },
  { id: StationsEnum.FIP_ROCK, name: 'FIP_ROCK', value: `${PREFIX}rock${SUFFIX}` },
  { id: StationsEnum.FIP_WORLD, name: 'FIP_WORLD', value: `${PREFIX}world${SUFFIX}` },
  { id: StationsEnum.Bassdrive, name: 'Bassdrive', value: 'http://chi.bassdrive.co/;stream/1' }
];
