export interface AudioNodeElement {
    audioCtx: AudioContext;
    audioNode: AudioNode;
    initNode(): void;
    connectNode(): void;
    disconnectNode?(): void;
    resetParam?(): void;
}
