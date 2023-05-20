import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { Alert } from '../../models/alert.interface';
import { AlertService } from '../../services/alert.service';
import { DestroyService } from '../../../shared/services/destroy.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  public alerts: any[] = [];

  constructor(
    private alertService: AlertService,
    private destroy$: DestroyService
  ) {}

  ngOnInit(): void {
    this.alertService.getAlerts$
      .pipe(takeUntil(this.destroy$))
      .subscribe((alert: Alert) => this.alerts.push(alert));
  }

  public close(i: number): void {
    this.alerts.splice(i, 1);
  }
}