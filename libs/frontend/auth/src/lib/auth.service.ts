import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@hour-master/shared/environments';
import { BehaviorSubject, Observable, catchError, map, of, throwError } from 'rxjs';
import { IUser, Id, Token, UserRole } from '@hour-master/shared/api';
import { AlertService } from '@hour-master/frontend/common';

/**
 * See https://angular.io/guide/http#requesting-data-from-a-server
 */
export const httpOptions = {
  observe: 'body',
  responseType: 'json',
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  endpoint = `${environment.dataApiUrl}/api/auth`;

  private readonly CURRENT_USER_TOKEN = 'currentusertoken';
  private readonly CURRENT_USER = 'currentuser';

  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  currentUserToken$ = new BehaviorSubject<Token | null>(null);
  currentUser$ = new BehaviorSubject<IUser | null>(null);

  constructor(
    private readonly http: HttpClient,
    private readonly alertService: AlertService
  ) {
    this.getUserTokenFromLocalStorage().subscribe((token) => {
      if (token) {
        this.currentUserToken$.next(token);
      }
    });

    this.getUserFromLocalStorage().subscribe((user) => {
      if (user) {
        this.currentUser$.next(user);
      }
    });
  }

  public login(username: string, password: string): Observable<Token> {
    console.log(`login at ${this.endpoint}/login`);

    return this.http
      .post(
        `${this.endpoint}/login`,
        { username, password },
        { headers: this.headers }
      )
      .pipe(
        map((response: any) => {
          const token = response.results.access_token;
          const user = response.results.user;
          this.currentUserToken$.next(token);
          this.currentUser$.next(user);
          this.saveUserTokenToLocalStorage(token);
          this.saveUserToLocalStorage(user);
          this.alertService.success(`Welkom ${user.firstname}!`);
          return token;
        }),
        catchError((error: any) => {
          this.alertService.danger(`Gebruikersnaam of wachtwoord is incorrect!`);
          return this.handleError(error);
        })
      );
  }

  public logout(): void {
    this.currentUserToken$.next(null);
    this.currentUser$.next(null);
    localStorage.removeItem(this.CURRENT_USER_TOKEN);
    localStorage.removeItem(this.CURRENT_USER);
    this.alertService.success('Je bent uitgelogd!');
  }

  getUserTokenFromLocalStorage(): Observable<Token | null> {
    const localToken = localStorage.getItem(this.CURRENT_USER_TOKEN);
    if (localToken) {
      return of(JSON.parse(localToken));
    } else {
      return of(null);
    }
  }

  getUserFromLocalStorage(): Observable<IUser | null> {
    const localUser = localStorage.getItem(this.CURRENT_USER);
    if (localUser) {
      return of(JSON.parse(localUser));
    } else {
      return of(null);
    }
  }

  getUserFromLocalStorageSync(): IUser | null {
    const localUser = localStorage.getItem(this.CURRENT_USER);
    if (localUser) {
      return JSON.parse(localUser);
    } else {
      return null;
    }
  }

  private saveUserTokenToLocalStorage(user: Token): void {
    localStorage.setItem(this.CURRENT_USER_TOKEN, JSON.stringify(user));
  }

  private saveUserToLocalStorage(user: IUser): void {
    localStorage.setItem(this.CURRENT_USER, JSON.stringify(user));
  }

  userMayAccessUsers(): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user) => {
        if (user) {
          return user.role === UserRole.ADMIN || user.role === UserRole.OFFICE;
        }

        return false;
      })
    );
  }

  userMayEditUser(itemUserId: Id): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user) => {
        if (user) {
          return user.role === UserRole.ADMIN && user._id !== itemUserId;
        }

        return false;
      })
    );
  }

  userMayCreateUsers(): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user) => {
        if (user) {
          return user.role === UserRole.ADMIN;
        }

        return false;
      })
    );
  }

  userMayEditHourSchemes(): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user) => {
        if (user) {
          return user.role === UserRole.ADMIN || user.role === UserRole.ROADWORKER;
        }

        return false;
      })
    );
  }

  userMayEditHourScheme(id: Id): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user) => {
        if (user) {
          return user.role === UserRole.ADMIN || user._id === id;
        }

        return false;
      })
    );
  }

  userMaySeeMachineDetails(): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user) => {
        if (user) {
          return user.role === UserRole.ADMIN || user.role === UserRole.OFFICE;
        }

        return false;
      })
    );
  }

  userMaySeeProjectDetails(): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user) => {
        if (user) {
          return user.role === UserRole.ADMIN || user.role === UserRole.OFFICE;
        }

        return false;
      })
    );
  }

  userMayEditProject(id: Id): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user) => {
        if (user) {
          return user.role === UserRole.ADMIN || user._id === id;
        }

        return false;
      })
    );
  }

  userIsLoggedIn(): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user) => {
        if (user) {
          return true;
        }

        return false;
      })
    );
  }

  /**
   * Handle errors.
   */
  public handleError(error: HttpErrorResponse): Observable<any> {
    console.log('handleError in HourSchemeService', error);

    return throwError(() => new Error(error.message));
  }
}
