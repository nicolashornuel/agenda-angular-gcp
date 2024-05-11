import {Component, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs';
import {Alert} from '@shared/models/alert.interface';
import {AlertService} from '@shared/services/alert.service';
import {DestroyService} from '@shared/services/destroy.service';
import {alertAnimation} from '@shared/models/triggerAnimation.constant';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  animations: [alertAnimation]
})
export class AlertComponent implements OnInit {
  public alerts: any[] = [];

  constructor(private alertService: AlertService, private destroy$: DestroyService) {}

  ngOnInit(): void {
    this.alertService.getAlerts$.pipe(takeUntil(this.destroy$)).subscribe((alert: Alert) => {
      this.alerts.push(alert);
      if (alert.title === 'Success')
        setTimeout(() => this.close(this.alerts.length -1), 1500);
    });
  }

  public close(i: number): void {
    this.alerts.splice(i, 1);
  }
}
