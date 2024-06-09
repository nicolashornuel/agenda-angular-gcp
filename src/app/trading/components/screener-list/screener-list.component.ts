import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-screener-list',
  templateUrl: './screener-list.component.html',
  styleUrls: ['./screener-list.component.scss']
})
export class ScreenerListComponent implements OnInit {
  public width!: number | string;
  public height!: number | string;

  ngOnInit(): void {
    this.width = "100%";
    this.height = window.innerHeight - 251;
  }
}
