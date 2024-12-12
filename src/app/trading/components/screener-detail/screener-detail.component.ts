import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Modal } from '@shared/models/modalParam.interface';
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
  public symbols: any[] = [];
  public symbol!: any;

  ngOnInit(): void {
    this.intervals = Object.values(IntervalType);
    this.symbols = Object.values(SymbolType).map(symbol => ({
      name: symbol.toLowerCase(),
      value: symbol
    }));
    this.symbol = this.symbols[0];
  }
}
