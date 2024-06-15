import {Component, OnInit, TemplateRef} from '@angular/core';
import { Modal, ModalParam } from '@shared/models/modalParam.interface';
import {DestroyService} from '@shared/services/destroy.service';
import { ModalService } from '@shared/services/shared.observable.service';
import { AudioNodeController } from 'app/radio/abstracts/audioDirective.abstract';
import { AudioSelectParam, AudioSelectParamService, SelectParam } from 'app/radio/services/audio.firestore.service';

import {takeUntil} from 'rxjs';

@Component({
  selector: 'app-audio-control-equ',
  templateUrl: './audio-control-equ.component.html',
  styleUrls: ['./audio-control-equ.component.scss']
})
export class AudioControlEquComponent extends AudioNodeController implements OnInit {
  private readonly FREQS = [32, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
  private readonly MESSAGE_DEFAULT = 'Défaut';
  private readonly MESSAGE_NEW = 'Nouveau';
  public readonly DEFAULT_PARAM = {name: this.MESSAGE_DEFAULT, value: this.FREQS.map(_freq => 0), isDirty: false};

  public equalizerParam?: AudioSelectParam;
  public eqs!: BiquadFilterNode[];
  public options!: SelectParam[];
  public selected!: SelectParam;
  public isLoading = true;

  constructor(
    private audioSelectParamService: AudioSelectParamService,
    private modalService: ModalService,
    private destroy$: DestroyService
  ) {
    super();
  }
  ngOnInit(): void {
    this.initNode();
    this.connectNode();
    this.initSelect();
  }

  protected override initNode(): void {
    this.eqs = this.FREQS.map(freq => {
      const biquad = new BiquadFilterNode(this.audioCtx);
      biquad.type = 'peaking';
      biquad.frequency.value = freq;
      biquad.Q.value = 1.4;
      return biquad;
    });
  }

  protected override connectNode(): void {
    this.gainNode.connect(this.eqs[0]);
    for (let i = 1; i < this.eqs.length; i++) {
      this.eqs[i - 1].connect(this.eqs[i]);
    }
    this.eqs[this.eqs.length - 1].connect(this.gainNode.context.destination);
  }

  private async initSelect(): Promise<void> {

    this.audioSelectParamService
      .findFirstByType('equalizer')
      .pipe(takeUntil(this.destroy$))
      .subscribe(equalizerParam => {
        if (equalizerParam) {
          this.equalizerParam = equalizerParam;
          this.options = [this.DEFAULT_PARAM, ...equalizerParam!.list.map(selectParam => ({...selectParam, isDirty: false}))];
          this.selected = this.options[equalizerParam!.selected ?? 0 ];
        } else {
          this.options = [this.DEFAULT_PARAM];
          this.selected = this.options [0];
        }
        this.isLoading = false;
        this.updateNode();
      });
  }

  private updateNode(): void {
    this.eqs.forEach((eq, i) => (eq.gain.value = this.selected?.value.at(i) as number));
  }

  private async saveParam(index: number): Promise<void> {
    const equalizerParam: AudioSelectParam = {
      ...this.equalizerParam!,
      list: this.options
        .filter(option => option.name !== this.MESSAGE_DEFAULT)
        .map(option => ({name: option.name, value: option.value})),
      selected: index
    };
    equalizerParam.id
      ? this.audioSelectParamService.updateOne(equalizerParam)
      : this.audioSelectParamService.createOne(equalizerParam, 'equalizer');
  }

  public onResetSelected(): void {
    this.selected.value = this.equalizerParam!.list.find(selectParam => selectParam.name === this.selected.name)!.value;
    this.selected.isDirty = false;
    this.updateNode();
  }

  public async onSaveAll(): Promise<void> {
    this.modalService.set$(undefined);
    this.selected.isDirty = false;
    const index = this.options.findIndex(option => option.name === this.selected.name);
    await this.saveParam(index);
  }

  public async onDeleteSelected(): Promise<void> {
    const index = this.options.findIndex(option => option.name === this.selected.name);
    this.options.splice(index, 1);
    await this.saveParam(this.options.length - 1);
  }

  public async onCreate(selectParam: SelectParam): Promise<void> {
    this.options.push(selectParam);
    this.selected = this.options[this.options.length - 1];
    this.modalService.set$(undefined);
    await this.saveParam(this.options.length - 1);
  }

  public onOpenModal(templateRef: TemplateRef<Modal>): void {
    const selectParam: SelectParam = {
      isDirty: false,
      name: this.MESSAGE_NEW,
      value: this.eqs.map(eq => eq.gain.value)
    };
    const modalParam: ModalParam = {
      title: `Paramêtre d'equaliser prédéfini`,
      context: {$implicit: selectParam},
      template: templateRef
    };
    this.modalService.set$(modalParam);
  }

  public onSelect(): void {
    this.updateNode();
  }

  public onSliderChange(): void {
    this.selected!.isDirty = true;
    this.selected!.value = this.eqs.map(eq => eq.gain.value);
  }
}
