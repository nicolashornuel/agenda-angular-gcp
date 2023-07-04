import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {StorageService} from 'app/core/services/storage.service';
import {User} from 'app/core/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() items: {title: string; route: string}[] = [];
  @Output() signOut = new EventEmitter<void>();
  public userImg: SafeUrl | undefined;

  constructor(private storage: StorageService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const user: User = this.storage.getLocalItem('user');
    this.userImg = user.photoURL ? this.sanitizer.bypassSecurityTrustUrl(user.photoURL) : undefined;
  }
}
