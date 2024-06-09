import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Modal, ModalParam } from '@shared/models/modalParam.interface';
import { ModalService } from '@shared/services/shared.observable.service';
import { SymbolType } from 'app/trading/model/symbol.enum';
import { IntervalType } from 'app/trading/model/tv-analysis.interface';


@Component({
  selector: 'app-screener-detail',
  templateUrl: './screener-detail.component.html',
  styleUrls: ['./screener-detail.component.scss']
})
export class ScreenerDetailComponent implements OnInit {
  
  @ViewChild('modal') modal!: TemplateRef<Modal>;
  public intervals: IntervalType[] = [];
  public symbol!: SymbolType;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.intervals = Object.values(IntervalType);
    this.symbol = SymbolType.EURUSD;
  }

  openModal(): void {
    const modalParam: ModalParam = {
      title: `title`,
      context: {$implicit: this.intervals},
      template: this.modal
    };
    this.modalService.set$(modalParam);
  }

}
