import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from '@hour-master/shared/environments';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, throwError } from 'rxjs';
import { IUser, Token } from '@hour-master/shared/api';

/**
 * See https://angular.io/guide/http#requesting-data-from-a-server
 */
export const httpOptions = {
  observe: 'body',
  responseType: 'json',
};

@Injectable()
export class AuthService {
  endpoint = `${environment.dataApiUrl}/api/auth`;

  public currentUserToken$ = new BehaviorSubject<Token>('');

  private readonly CURRENT_USER = 'currentuser';

  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
  })

  constructor(private readonly http: HttpClient) {
    this.getUserTokenFromLocalStorage()
      .pipe(
        switchMap((token: Token) => {
          if(token) {
            this.currentUserToken$.next(JSON.parse(token));
            return of(token);
          } else {
            return of('');
          }
        })
      )
      .subscribe(() => console.log('currentUserToken$ initialized'));
  }

  public login(username: string, password: string): Observable<Token> {
    console.log(`login at ${this.endpoint}/login`);

    return this.http.post(
      `${this.endpoint}/login`,
      { username, password },
      { headers: this.headers }
    ).pipe(
        map((response: any) => {
          const token = response.results.access_token;
          this.saveUserTokenToLocalStorage(token);
          this.currentUserToken$.next(token);
          return token;
        }),
        catchError((error: any) => {
          return this.handleError(error);
        })
      )
  }

  getUserTokenFromLocalStorage(): Observable<Token> {
    const localToken = localStorage.getItem(this.CURRENT_USER);
    return of(localToken || '');
  }

  private saveUserTokenToLocalStorage(user: Token): void {
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
