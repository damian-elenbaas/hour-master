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
import { MachineDetailsComponent, MachineEditComponent, MachineListComponent } from '@hour-master/frontend/features/machine';

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
    canMatch: [authGuard()]
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
    canMatch: [authGuard()]
  },
  {
    path: 'user',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: UserListComponent,
        canMatch: [authGuard([UserRole.ADMIN, UserRole.OFFICE])]
      },
      {
        path: 'new',
        pathMatch: 'full',
        component: UserEditComponent,
        canMatch: [authGuard([UserRole.ADMIN, UserRole.OFFICE])]
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
        canMatch: [authGuard([UserRole.ADMIN, UserRole.OFFICE])]
      },
    ],
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
    canMatch: [authGuard([UserRole.ADMIN, UserRole.OFFICE])]
  },
  {
    path: 'machine',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: MachineListComponent,
      },
      {
        path: 'new',
        pathMatch: 'full',
        component: MachineEditComponent,
      },
      {
        path: ':id',
        pathMatch: 'full',
        component: MachineDetailsComponent,
      },
      {
        path: ':id/edit',
        pathMatch: 'full',
        component: MachineEditComponent,
      },
    ],
    canMatch: [authGuard([UserRole.ADMIN, UserRole.OFFICE])]
  }
];
