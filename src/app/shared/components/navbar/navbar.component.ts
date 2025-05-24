import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import { KEY_STORAGE_USER } from '@core/services/auth.service';
import {StorageService} from '@core/services/storage.service';
import {User} from '@core/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() items: {title: string; route: string}[] = [];
  @Output() signOut = new EventEmitter<void>();
  public userImg: SafeUrl | undefined;
  public isOpen: boolean = false;

  constructor(private storage: StorageService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const user: User = this.storage.getLocalItem(KEY_STORAGE_USER);
    this.userImg = user && user.photoURL ? this.sanitizer.bypassSecurityTrustUrl(user.photoURL) : undefined;
  }
}
