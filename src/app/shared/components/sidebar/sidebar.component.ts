import { Component, inject, Input } from '@angular/core';
import { BehaviorSubjectService } from '@shared/abstracts/observable.abstract';
import { DestroyService } from '@shared/services/destroy.service';
import { IsMobileService } from '@shared/services/shared.observable.service';
import { takeUntil } from 'rxjs';

export interface SidebarConfig {
  width?: string;
  isOpenedService?: BehaviorSubjectService<boolean>;
  position?: 'left' | 'right';
  color?: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() config: SidebarConfig = { width: "710px" }

  isOpen: boolean = false;
  protected isMobileService = inject(IsMobileService);
  protected destroy$ = inject(DestroyService);
  
  ngOnInit(): void {
    this.config.isOpenedService?.get$.pipe(takeUntil(this.destroy$)).subscribe(isOpened => this.isOpen = isOpened)
  }

  onToggleOpen(): void {
    this.isOpen = !this.isOpen;
    this.config.isOpenedService?.set$(this.isOpen);
  }
}
