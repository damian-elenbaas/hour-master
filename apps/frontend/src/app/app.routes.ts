import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@hour-master/frontend/features').then(
        (m) => m.FeaturesModule
      )
  }
];
