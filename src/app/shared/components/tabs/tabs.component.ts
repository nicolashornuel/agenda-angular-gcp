import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import { TabParam } from '@shared/models/tabParam.interface';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit, OnChanges {
  @Input() items: TabParam[] = [];
  protected selected = 0;

  constructor(private el: ViewContainerRef) {}

  ngOnInit(): void {
    this.renderTab();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.selected = this.items.length - 1;
    this.renderTab();
  }

  onChangeTab(index: number): void {
    this.selected = index;
    this.renderTab();
  }

  private renderTab(): void {
    this.el.clear();
    const item = this.items[this.selected];
    if (!item?.content) return;
    const componentRef = this.el.createComponent<any>(item.content);
    item.bind?.(componentRef);
  }

  onCloseTab(index: number) {
    const tab = this.items[index];
    tab.onClose?.();
    this.items.splice(index, 1);
    if (index === this.selected && index === this.items.length) {
      // je ferme la tab courante qui est dernière
      this.selected = index - 1;
      this.renderTab();
    } else if (index === this.selected && index !== this.items.length) {
      // je ferme la tab courante qui n'est pas dernière
      this.selected = index;
      this.renderTab();
    } else {
      this.selected = this.selected - 1;
    }
  }
}
