import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private componentRef!: ComponentRef<any>;
  private componentSubscriber!: Subject<any>;

  openModal(container: ViewContainerRef, component: any, data?: any) {
    this.componentRef = container.createComponent(component);
    this.componentSubscriber = new Subject<any>();
    this.componentRef.instance.data = data;
    this.componentRef.instance.response.subscribe((response: any) => {
      this.componentSubscriber.next(response);
      this.closeModal();
    });
    return this;
  }

  closeModal() {
    this.componentSubscriber.complete();
    this.componentRef.destroy();
  }

  listenEvent() {
    return this.componentSubscriber.asObservable();
  }

  bindData(data: any) {
    this.componentRef.instance.data = data;
  }
}
