import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ApiResponse, ICreateUser, IServiceResult, IUpdateUser, IUser, Id } from '@hour-master/shared/api';
import { environment } from '@hour-master/shared/environments';

/**
 * See https://angular.io/guide/http#requesting-data-from-a-server
 */
export const httpOptions = {
  observe: 'body',
  responseType: 'json',
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  endpoint = `${environment.dataApiUrl}/api/user`;

  constructor(private readonly http: HttpClient) { }

  /**
   * Get all users.
   *
   * @options options - optional URL queryparam options
   */
  public list(options?: any): Observable<IUser[] | null> {
    console.log(`list ${this.endpoint}`);

    return this.http
      .get<ApiResponse<IUser[]>>(this.endpoint, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        map((response: any) => response.results as IUser[]),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  /**
   * Get one user.
   *
   * @param id - item id
   * @param options - optional URL queryparam options
   * @returns Observable<IUser | null>
   */
  public details(id: Id, options?: any): Observable<IUser| null> {
    console.log(`details ${this.endpoint}/${id}`);

    return this.http
      .get<ApiResponse<IUser>>(`${this.endpoint}/${id}`, {
        ...options,
        ...httpOptions
      })
      .pipe(
        map((response: any) => response.results as IUser),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  /**
   * Update user.
   *
   * @param id - item id
   * @param user - user to update
   * @param options - optional URL queryparam options
   * @returns Observable<boolean | null>
   */
  public update(id: Id, user: IUpdateUser, options?: any): Observable<boolean | null> {
    return this.http
      .patch<ApiResponse<boolean>>(`${this.endpoint}/${id}`, user, {
        ...options,
        ...httpOptions
      })
      .pipe(
        map((response: any) => response.results as boolean),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  /**
   * Create user.
   *
   * @param user - user to create
   * @param options - optional URL queryparam options
   * @returns Observable<IUser | null>
   */
  public create(user: ICreateUser, options?: any): Observable<IUser | null> {
    return this.http
      .post<ApiResponse<IUser>>(`${this.endpoint}`, user, {
        ...options,
        ...httpOptions
      })
      .pipe(
        map((response: any) => response.results as IUser),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  /**
   * Handle errors.
   */
  public handleError(error: HttpErrorResponse): Observable<any> {
    console.log('handleError in UserService', error);

    return throwError(() => new Error(error.error.message));
  }

}
