import { Route } from '@angular/router';
import {
  HomeComponent,
  AboutComponent,
  LoginComponent
} from '@hour-master/frontend/features/static';
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
import {
  ProjectDetailsComponent,
  ProjectEditComponent,
  ProjectListComponent
} from '@hour-master/frontend/features/project';
import { authGuard } from '@hour-master/frontend/auth';
import { UserRole } from '@hour-master/shared/api';

// BUG: Lazy loading is not working as expected because of the following:
// https://angular.io/guide/providers#limiting-provider-scope-by-lazy-loading-modules

export const appRoutes: Route[] = [
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
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    canActivate: [authGuard()]
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
    canActivate: [authGuard()]
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
        path: 'new',
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
    canActivate: [authGuard([UserRole.ADMIN])]
  },
  {
    path: 'project',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ProjectListComponent
      },
      {
        path: 'new',
        pathMatch: 'full',
        component: ProjectEditComponent
      },
      {
        path: ':id',
        pathMatch: 'full',
        component: ProjectDetailsComponent
      },
      {
        path: ':id/edit',
        pathMatch: 'full',
        component: ProjectEditComponent
      }
    ],
    canActivate: [authGuard([UserRole.ADMIN, UserRole.OFFICE])]
  }
];
