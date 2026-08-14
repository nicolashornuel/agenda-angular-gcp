import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export abstract class AbstractCoreService {
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);
}
