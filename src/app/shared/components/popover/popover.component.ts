import { Component, OnInit } from '@angular/core';
import { PopoverParam } from '@shared/models/popoverParam.interface';
import { DestroyService } from '@shared/services/destroy.service';
import { PopoverService } from '@shared/services/shared.observable.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class PopoverComponent implements OnInit {
  param: PopoverParam | null | undefined;

  constructor(private popoverService: PopoverService, private destroy$: DestroyService) {}

  ngOnInit(): void {
    this.popoverService.get$.pipe(takeUntil(this.destroy$)).subscribe(param => (this.param = param));
  }

  public onClose(): void {
    this.popoverService.set$(undefined);
  }
}
