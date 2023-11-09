import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@hour-master/frontend/static').then(
        (m) => m.StaticModule
      )
  },
  {
    path: 'hour-scheme',
    pathMatch: 'full',
    loadChildren: () =>
      import('@hour-master/frontend/features/hour-scheme').then(
        (m) => m.HourSchemeModule
      )
  }
];
