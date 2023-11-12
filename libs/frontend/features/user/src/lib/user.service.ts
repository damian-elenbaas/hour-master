import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ApiResponse, IServiceResult, IUpdateUser, IUser, Id } from '@hour-master/shared/api';

/**
 * See https://angular.io/guide/http#requesting-data-from-a-server
 */
export const httpOptions = {
  observe: 'body',
  responseType: 'json',
};

@Injectable()
export class UserService {
  endpoint = 'http://localhost:3000/api/user';

  constructor(private readonly http: HttpClient) { }


  /**
   * Get all items.
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

  public update(id: Id, user: IUpdateUser, options?: any): Observable<boolean | null> {
    return this.http
      .patch<ApiResponse<IServiceResult<IUser>>>(`${this.endpoint}/${id}`, user, {
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
   * Handle errors.
   */
  public handleError(error: HttpErrorResponse): Observable<any> {
    console.log('handleError in UserService', error);

    return throwError(() => new Error(error.message));
  }

}
