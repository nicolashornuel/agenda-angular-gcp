import {Component, OnInit} from '@angular/core';
import {DestroyService} from '@shared/services/destroy.service';
import {takeUntil} from 'rxjs';
import { TabResultService } from '../services/musique.observable.service';

@Component({
  selector: 'app-page-musique',
  templateUrl: './page-musique.component.html',
  styleUrls: ['./page-musique.component.scss']
})
export class PageMusiqueComponent implements OnInit {
  keywords: string[] = [];
  tabSelected: number = -1;

  constructor(private destroy$: DestroyService, private tabService: TabResultService) {}

  ngOnInit(): void {
    this.tabService.get$.pipe(takeUntil(this.destroy$)).subscribe(tab => this.keywords.push(tab));
  }

  onSearch(keyword: string) {
    this.tabService.set$(keyword);
  }

  onCloseTab(index: number) {
    this.keywords.splice(index, 1);
  }
}
