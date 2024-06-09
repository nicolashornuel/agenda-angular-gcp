import { Component, Input, OnInit } from '@angular/core';
import { DestroyService } from '@shared/services/destroy.service';
import { RightBarIsOpenedService } from '@shared/services/shared.observable.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-right-bar',
  templateUrl: './right-bar.component.html',
  styleUrls: ['./right-bar.component.scss']
})
export class RightBarComponent implements OnInit {

  @Input('width') width: string = "600px";
  isOpen: boolean = false;

  constructor(private isOpenService: RightBarIsOpenedService, private destroy$: DestroyService) {}
  
  ngOnInit(): void {
    this.isOpenService.get$.pipe(takeUntil(this.destroy$)).subscribe(isOpened => this.isOpen = isOpened)
  }

  onToggleOpen(): void {
    this.isOpen = !this.isOpen;
    this.isOpenService.set$(this.isOpen);
  }

}
