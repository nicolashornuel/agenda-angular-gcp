import { Component, Input, OnInit } from '@angular/core';
import { DestroyService } from '@shared/services/destroy.service';
import { LeftBarIsOpenedService } from '@shared/services/shared.observable.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-left-bar',
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.scss']
})
export class LeftBarComponent  implements OnInit {

  @Input('width') width: string = "710px";
  isOpen: boolean = false;

  constructor(private isOpenService: LeftBarIsOpenedService, private destroy$: DestroyService) {}
  
  ngOnInit(): void {
    this.isOpenService.get$.pipe(takeUntil(this.destroy$)).subscribe(isOpened => this.isOpen = isOpened)
  }

  onToggleOpen(): void {
    this.isOpen = !this.isOpen;
    this.isOpenService.set$(this.isOpen);
  }

}
