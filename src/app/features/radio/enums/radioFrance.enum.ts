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
  FRANCEBLEU_HERAULT = 'FRANCEBLEU_HERAULT',
  FRANCECULTURE = 'FRANCECULTURE',
  FRANCEINFO = 'FRANCEINFO',
  FRANCEINTER = 'FRANCEINTER',
  FRANCEMUSIQUE = 'FRANCEMUSIQUE',
  Bassdrive = 'Bassdrive'
}

const PREFIX = 'https://icecast.radiofrance.fr/';
const SUFFIX = '-midfi.mp3?id=openapi';

export interface StationSelectable {
  id: StationsEnum;
  name: string;
  value: String;
}
export const Stations: StationSelectable[] = [
  { id: StationsEnum.FIP, name: 'Fip', value: `${PREFIX}fip${SUFFIX}` },
  { id: StationsEnum.FIP_ELECTRO, name: 'Fip Electro', value: `${PREFIX}fipelectro${SUFFIX}` },
  { id: StationsEnum.FIP_GROOVE, name: 'Fip Groove', value: `${PREFIX}fipgroove${SUFFIX}` },
  { id: StationsEnum.FIP_JAZZ, name: 'Fip Jazz', value: `${PREFIX}fipjazz${SUFFIX}` },
  { id: StationsEnum.FIP_METAL, name: 'Fip Metal', value: `${PREFIX}fipmetal${SUFFIX}` },
  { id: StationsEnum.FIP_NOUVEAUTES, name: 'Fip Nouveautés', value: `${PREFIX}fipnouveautes${SUFFIX}` },
  { id: StationsEnum.FIP_POP, name: 'Fip Pop', value: `${PREFIX}fippop${SUFFIX}` },
  { id: StationsEnum.FIP_HIP_HOP, name: 'Fip Hip-Hop', value: `${PREFIX}fiphiphop${SUFFIX}` },
  { id: StationsEnum.FIP_REGGAE, name: 'Fip Reggae', value: `${PREFIX}fipreggae${SUFFIX}` },
  { id: StationsEnum.FIP_ROCK, name: 'Fip Rock', value: `${PREFIX}fiprock${SUFFIX}` },
  { id: StationsEnum.FIP_WORLD, name: 'Fip World', value: `${PREFIX}fipworld${SUFFIX}` },
  { id: StationsEnum.FRANCEBLEU_HERAULT, name: 'France Bleu Hérault', value: `${PREFIX}fbherault${SUFFIX}` },
  { id: StationsEnum.FRANCECULTURE, name: 'France Culture', value: `${PREFIX}franceculture-lofi.mp3?id=openapi` },
  { id: StationsEnum.FRANCEINFO, name: 'France Info', value: `${PREFIX}franceinfo${SUFFIX}` },
  { id: StationsEnum.FRANCEINTER, name: 'France Inter', value: `${PREFIX}franceinter${SUFFIX}` },
  { id: StationsEnum.FRANCEMUSIQUE, name: 'France Musique', value: `${PREFIX}francemusique${SUFFIX}` },
  { id: StationsEnum.Bassdrive, name: 'Bassdrive', value: 'https://bassdrive.radioca.st/stream' }, //http://chi.bassdrive.co/;stream/1
];