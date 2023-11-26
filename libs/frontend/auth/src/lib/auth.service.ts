import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@hour-master/shared/environments';
import { BehaviorSubject, Observable, catchError, map, of, throwError } from 'rxjs';
import { IUser, Token } from '@hour-master/shared/api';

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

  constructor(private readonly http: HttpClient) {
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
          return token;
        }),
        catchError((error: any) => {
          return this.handleError(error);
        })
      );
  }

  public logout(): void {
    this.currentUserToken$.next(null);
    this.currentUser$.next(null);
    localStorage.removeItem(this.CURRENT_USER_TOKEN);
    localStorage.removeItem(this.CURRENT_USER);
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

  private saveUserTokenToLocalStorage(user: Token): void {
    localStorage.setItem(this.CURRENT_USER_TOKEN, JSON.stringify(user));
  }

  private saveUserToLocalStorage(user: IUser): void {
    localStorage.setItem(this.CURRENT_USER, JSON.stringify(user));
  }

  /**
   * Handle errors.
   */
  public handleError(error: HttpErrorResponse): Observable<any> {
    console.log('handleError in HourSchemeService', error);

    return throwError(() => new Error(error.message));
  }
}
