import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ApiResponse, IMachine, Id } from '@hour-master/shared/api';
import { environment } from '@hour-master/shared/environments';

/**
 * See https://angular.io/guide/http#requesting-data-from-a-server
 */
export const httpOptions = {
  observe: 'body',
  responseType: 'json',
};

@Injectable()
export class MachineService {
  endpoint = `${environment.dataApiUrl}/api/machine`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Get all items.
   *
   * @options options - optional URL queryparam options
   */
  public list(options?: any): Observable<IMachine[] | null> {
    console.log(`list ${this.endpoint}`);

    return this.http
      .get<ApiResponse<IMachine[]>>(this.endpoint, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        map((response: any) => response.results as IMachine[]),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  public details(id: Id, options?: any): Observable<IMachine | null> {
    console.log(`details ${this.endpoint}/${id}`);

    return this.http
      .get<ApiResponse<IMachine>>(`${this.endpoint}/${id}`, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        map((response: any) => response.results as IMachine),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  public create(scheme: IMachine, options?: any): Observable<IMachine | null> {
    console.log(`create ${this.endpoint}`);

    return this.http
      .post<ApiResponse<IMachine>>(this.endpoint, scheme, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        map((response: any) => response.results as IMachine),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  public update(machine: IMachine, options?: any): Observable<IMachine | null> {
    console.log(`update ${this.endpoint}/${machine._id}`);

    return this.http
      .put<ApiResponse<IMachine>>(`${this.endpoint}/${machine._id}`, machine, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        map((response: any) => response.results as IMachine),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  public delete(id: Id, options?: any): Observable<boolean | null> {
    console.log(`delete ${this.endpoint}/${id}`);

    return this.http
      .delete<ApiResponse<boolean>>(`${this.endpoint}/${id}`, {
        ...options,
        ...httpOptions,
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
    console.log('handleError in HourSchemeService', error);

    return throwError(() => new Error(error.message));
  }
}
