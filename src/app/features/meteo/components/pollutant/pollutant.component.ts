import { Component, inject, Input, OnInit } from '@angular/core';
import { WikipediaService } from '@core/services/wikipedia.service';
import { combineLatest, forkJoin, map, tap } from 'rxjs';

@Component({
  selector: 'app-pollutant',
  templateUrl: './pollutant.component.html',
  styleUrls: ['./pollutant.component.scss']
})
export class PollutantComponent implements OnInit {
  @Input() public pollutants: any;
  @Input() view: 'col' | 'row' = 'col';
  private wikiService = inject(WikipediaService);
  public isLoading = false;

  ngOnInit(): void {
    this.isLoading = true;
    const requests = this.pollutants.map((pollutant: any) => this.wikiService.getWiki(pollutant.wiki, 'fr'));
    forkJoin(requests).subscribe((responses: any) => {
      this.pollutants.forEach((item: any, index: number) => item.wikiContent = responses[index]);
      this.isLoading = false;
    });
  }
}
