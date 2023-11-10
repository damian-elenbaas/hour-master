import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ApiResponse, IHourScheme, Id } from '@hour-master/shared/api';

/**
 * See https://angular.io/guide/http#requesting-data-from-a-server
 */
export const httpOptions = {
  observe: 'body',
  responseType: 'json',
};

@Injectable()
export class HourSchemeService {
  endpoint = 'http://localhost:3000/api/hour-scheme';

  constructor(private readonly http: HttpClient) { }


  /**
   * Get all items.
   *
   * @options options - optional URL queryparam options
   */
  public list(options?: any): Observable<IHourScheme[] | null> {
    console.log(`list ${this.endpoint}`);

    return this.http
      .get<ApiResponse<IHourScheme[]>>(this.endpoint, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        map((response: any) => response.results as IHourScheme[]),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  public details(id: Id, options?: any): Observable<IHourScheme | null> {
    console.log(`details ${this.endpoint}/${id}`);

    return this.http
      .get<ApiResponse<IHourScheme>>(`${this.endpoint}/${id}`, {
        ...options,
        ...httpOptions
      })
      .pipe(
        map((response: any) => response.results as IHourScheme),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  /**
   * Handle errors.
   */
  public handleError(error: HttpErrorResponse): Observable<any> {
    console.log('handleError in MealService', error);

    return throwError(() => new Error(error.message));
  }

}
