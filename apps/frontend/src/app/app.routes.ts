import { Route } from '@angular/router';
import {
  AboutComponent,
  HomeComponent,
  LoginComponent
} from '@hour-master/frontend/common';
import {
  HourSchemeDetailsComponent,
  HourSchemeEditComponent,
  HourSchemeListComponent,
} from '@hour-master/frontend/features/hour-scheme';
import {
  UserDetailsComponent,
  UserEditComponent,
  UserListComponent,
} from '@hour-master/frontend/features/user';

// Lazy loading is not working as expected because of the following:
// https://angular.io/guide/providers#limiting-provider-scope-by-lazy-loading-modules

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'about',
    pathMatch: 'full',
    component: AboutComponent,
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        pathMatch: 'full',
        component: LoginComponent,
      },
    ],
  },
  {
    path: 'hour-scheme',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HourSchemeListComponent,
      },
      {
        path: 'new',
        pathMatch: 'full',
        component: HourSchemeEditComponent,
      },
      {
        path: ':id',
        pathMatch: 'full',
        component: HourSchemeDetailsComponent,
      },
      {
        path: ':id/edit',
        pathMatch: 'full',
        component: HourSchemeEditComponent,
      },
    ],
  },
  {
    path: 'user',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: UserListComponent,
      },
      {
        path: 'edit',
        pathMatch: 'full',
        component: UserEditComponent,
      },
      {
        path: ':id',
        pathMatch: 'full',
        component: UserDetailsComponent,
      },
      {
        path: ':id/edit',
        pathMatch: 'full',
        component: UserEditComponent,
      },
    ],
  },
];
