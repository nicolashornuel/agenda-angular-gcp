export interface Note {
  label: 'Do' | 'Ré' | 'Mi' | 'Fa' | 'Sol' | 'La' | 'Si';
  key: 'do' | 're' | 'mi' | 'fa' | 'sol' | 'la' | 'si';
  frequencies: number[];
  checked?: boolean;
}

export interface Gamme {
  [key: string]: Note;
}

export const gamme: Gamme = {
  do: {
    key: 'do',
    label: 'Do',
    frequencies: [16, 32, 65, 130, 261, 523, 1046, 2093, 4186]
  },
  re: {
    key: 're',
    label: 'Ré',
    frequencies: [18, 36, 73, 146, 293, 587, 1174, 2349, 4698]
  },
  mi: {
    key: 'mi',
    label: 'Mi',
    frequencies: [20, 41, 82, 164, 329, 659, 1318, 2637, 5274]
  },
  fa: {
    key: 'fa',
    label: 'Fa',
    frequencies: [21, 43, 87, 174, 349, 698, 1396, 2793, 5587]
  },
  sol: {
    key: 'sol',
    label: 'Sol',
    frequencies: [24, 49, 98, 196, 392, 783, 1567, 3135, 6271]
  },
  la: {
    key: 'la',
    label: 'La',
    frequencies: [27, 55, 110, 220, 440, 880, 1760, 3520, 7040]
  },
  si: {
    key: 'si',
    label: 'Si',
    frequencies: [30, 61, 123, 246, 493, 987, 1975, 3951, 7902]
  }
};
