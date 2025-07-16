import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { IsAdmin } from '@core/decorators/hasRole.decorator';
import { StorageService } from '@core/services/storage.service';
import { Selectable } from '@shared/models/fieldSet.model';
import { Modal, ModalParam } from '@shared/models/modalParam.interface';
import { DestroyService } from '@shared/services/destroy.service';
import { ModalService } from '@shared/services/shared.observable.service';
import { AudioNodeController } from 'app/radio/abstracts/audioDirective.abstract';
import { AudioEqualizerService, EqualizerSelectable } from 'app/radio/services/audio.firestore.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-audio-control-equ',
  templateUrl: './audio-control-equ.component.html',
  styleUrls: ['./audio-control-equ.component.scss']
})
export class AudioControlEquComponent extends AudioNodeController implements OnInit {
  private readonly FREQS = [32, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
  private readonly KEY_STORAGE_EQ_SELECTED = 'audioEqualizerSelected';
  public defaultEqualizer!: EqualizerSelectable;
  public eqs!: BiquadFilterNode[];
  public options!: EqualizerSelectable[];
  public selected!: EqualizerSelectable;
  public isLoading!: boolean;
  private audioEqualizerService = inject(AudioEqualizerService);
  private modalService = inject(ModalService);
  private storage = inject(StorageService);
  private destroy$ = inject(DestroyService);

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
      biquad.Q.value = 1; //1.4
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
    this.isLoading = true;
    this.audioEqualizerService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(audioEqualizer => {
        this.defaultEqualizer = { name: 'Défaut', value: this.FREQS.map(_freq => 0), isDirty: false, id: 'default' };
        this.options = [this.defaultEqualizer, ...audioEqualizer];
        const selectedId = this.storage.getLocalItem(this.KEY_STORAGE_EQ_SELECTED);
        this.selected = this.options.find(option => option.id === selectedId) ?? this.options[0];
        this.isLoading = false;
        this.updateNode();
      });
  }

  private updateNode(): void {
    this.eqs.forEach((eq, i) => (eq.gain.value = this.selected.value[i]));
  }

  @IsAdmin()
  public onOpenModal(templateRef: TemplateRef<Modal>): void {
    const equalizerSelectable: EqualizerSelectable = {
      name: 'Nouveau',
      value: this.eqs.map(eq => eq.gain.value)
    };
    const modalParam: ModalParam<Selectable<any>> = {
      title: `Paramêtre d'equaliser prédéfini`,
      context: { $implicit: equalizerSelectable },
      template: templateRef
    };
    this.modalService.set$(modalParam);
  }

  @IsAdmin()
  public async onCreate(equalizerSelectable: EqualizerSelectable): Promise<void> {
    await this.audioEqualizerService.createOne(equalizerSelectable);
    this.options.push(equalizerSelectable);
    this.selected = this.options[this.options.length - 1];
    this.storage.setLocalItem(this.KEY_STORAGE_EQ_SELECTED, this.selected.id);
    this.modalService.set$(undefined);
  }

  @IsAdmin()
  public async onSave(): Promise<void> {
    this.modalService.set$(undefined);
    this.selected.isDirty = false;
    this.selected.name = this.selected.name.replace('*', '');
    this.audioEqualizerService.updateOne({ ...this.selected }, this.selected.id!);
  }

  @IsAdmin()
  public async onDelete(): Promise<void> {
    this.storage.removeLocalItem(this.KEY_STORAGE_EQ_SELECTED);
    await this.audioEqualizerService.delete(this.selected.id!);
  }

  public onReset(): void {
    this.initSelect();
  }

  public onSelect(): void {
    this.storage.setLocalItem(this.KEY_STORAGE_EQ_SELECTED, this.selected.id);
    this.updateNode();
  }

  public onSliderChange(): void {
    this.selected.isDirty = true;
    this.selected.name = this.selected.name.startsWith('*') ? `${this.selected.name}` : `*${this.selected.name}`;
    this.selected.value = this.eqs.map(eq => eq.gain.value);
  }
}
