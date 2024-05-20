import { Component, ComponentRef, Input, OnChanges, OnInit, SimpleChanges, ViewContainerRef } from '@angular/core';

export interface TabParam {
  name: string;
  closable: boolean;
  content: any;
  bind?: (componentRef: ComponentRef<any>) => void;
}
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit, OnChanges {
  @Input() items: TabParam[] = [];
  @Input() selected: number = 0;

  constructor(private el: ViewContainerRef) {}

  ngOnChanges(_changes: SimpleChanges): void {
    this.renderTab();  
  }

  ngOnInit(): void {
    this.renderTab();
  }

  onChangeTab(index: number): void {
    this.selected = index;
    this.renderTab();
  }

  onCloseTab(index: number) {
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

  private renderTab(): void {
    this.el.clear();
    const item = this.items[this.selected];
    const componentRef = this.el.createComponent<any>(item.content);
    if (item.bind) item.bind(componentRef);
  }
}
