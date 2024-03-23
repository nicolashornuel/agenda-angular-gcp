export interface Selectable {
    label: string; 
    value?: string;
    apply?: (counter: number) => void;
}