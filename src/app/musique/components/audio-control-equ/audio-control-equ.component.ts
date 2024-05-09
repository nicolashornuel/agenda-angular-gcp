import { Component, OnInit, TemplateRef } from '@angular/core';
import { Modal, ModalParam, ModalService } from '@shared/services/modal.service';
import { AudioNodeController } from 'app/musique/directives/audioDirective.abstract';
import { AudioSelectParam, AudioSelectParamService, SelectParam } from 'app/musique/services/audio.service';

@Component({
  selector: 'app-audio-control-equ',
  templateUrl: './audio-control-equ.component.html',
  styleUrls: ['./audio-control-equ.component.scss']
})
export class AudioControlEquComponent extends AudioNodeController implements OnInit {
  private readonly FREQS = [32, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
  private readonly MESSAGE_DEFAULT = 'Défaut';
  private readonly MESSAGE_NEW = 'Nouveau';
  private readonly DEFAULT_PARAM = [{name: this.MESSAGE_DEFAULT, value: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}];

  public eqs: BiquadFilterNode[] = [];
  public options: SelectParam[] = [];
  public selected?: SelectParam;
  public isDirty: boolean = false;

  constructor(private audioSelectParamService: AudioSelectParamService, private modalService: ModalService) {
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
    this.sourceNode.connect(this.eqs[0]);
    for (let i = 1; i < this.eqs.length; i++) {
      this.eqs[i - 1].connect(this.eqs[i]);
    }
    this.eqs[this.eqs.length - 1].connect(this.sourceNode.context.destination);
  }

  private async initSelect(): Promise<void> {
    this.options = this.DEFAULT_PARAM;
    this.selected = this.DEFAULT_PARAM[0];
    const selectParam = await this.audioSelectParamService.findFirstByType('equalizer');
    if (selectParam) {
      this.options = selectParam.list;
      this.selected = selectParam.list[selectParam.selected ?  selectParam.selected - 1 : 0];
      this.updateFilter();
    }
  }

  private updateFilter(): void {
    this.eqs.forEach((eq, i) => (eq.gain.value = this.selected?.value.at(i) as number));
  }

  public onReset(): void {
    this.eqs.forEach(eq => (eq.gain.value = 0));
    this.isDirty = false;
  }

  public async onSave(name: string): Promise<void> {
    this.selected!.name = name;
    const selectParam: AudioSelectParam = {
      list: [...this.options],
      selected: this.options.length - 1,
      type: 'equalizer'
    };
    selectParam.list.shift();
    this.modalService.set$(undefined);
    await this.audioSelectParamService.addOne(selectParam);
  }

  public onSelect(): void {
    this.updateFilter();
  }

  public onSliderChange(): void {
    this.isDirty = true;
    if (this.selected?.name == this.MESSAGE_DEFAULT) this.create();
  }

  public onOpenModal(templateRef: TemplateRef<Modal>): void {
    const modalParam: ModalParam = {
      title: `Paramêtre d'equaliser prédéfini`,
      context: {$implicit: this.options[this.options.length - 1]},
      template: templateRef
    };
    this.modalService.set$(modalParam);
  }

  public onCloseModal(): void {
    this.modalService.set$(undefined);
  }

  private create(): void {
    const eqParam: SelectParam = {
      name: this.MESSAGE_NEW,
      value: this.eqs.map(eq => eq.gain.value)
    };
    this.options.push(eqParam);
    this.selected = this.options[this.options.length - 1];
  }


}
