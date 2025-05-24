import { StorageService } from '@core/services/storage.service';
import { GlobalInjector } from './global-injector';
import { AuthService, KEY_STORAGE_USER } from '@core/services/auth.service';
import { AlertService } from '@shared/services/alert.service';
import { UserInfo } from '@angular/fire/auth';

export function IsAdmin() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const injector = GlobalInjector.injector;
      const storageService = injector.get(StorageService);
      const alertService = injector.get(AlertService);
      const authService = injector.get(AuthService);

      const user:  UserInfo = storageService.getLocalItem(KEY_STORAGE_USER);
      const exist = await authService.checkUser(user.uid);
      if (!exist) {
        alertService.error('Accès refusé. Vous devez être connecté en tant qu\'administrateur pour effectuer cette action.');
        return;
      }


      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
