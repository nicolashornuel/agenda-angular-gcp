import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  public width!: number | string;
  public height!: number;

  ngOnInit(): void {
    this.width = "100%";
    this.height = window.innerHeight - 251;
  }
}