import { EnvParam } from "./enveloppe.interface";

export interface OscParam {
    opened: boolean;
    muted: boolean;
    gain: number;
    detune: number;
    type: OscillatorType;
    octave: number;
    sequence: { [key: string]: string[] };
    eg: boolean;
    amp: number;
    envParam: EnvParam;
    modulation: {
      selected: string;
      speed: number;
      depth: number;
    }
    compressor: number;
    filter: {
      frequency: number, // 32, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000
      Q: number
    }
  }