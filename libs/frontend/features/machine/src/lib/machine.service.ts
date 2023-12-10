import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ApiResponse, IHourSchemeRow, IMachine, IProject, IUser, Id } from '@hour-master/shared/api';
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
  dataEndpoint = `${environment.dataApiUrl}/api/machine`;
  rcmndEnpoint = `${environment.rcmndApiUrl}/api/recommendations/machine`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Get all items.
   *
   * @options options - optional URL queryparam options
   */
  public list(options?: any): Observable<IMachine[] | null> {
    console.log(`list ${this.dataEndpoint}`);

    return this.http
      .get<ApiResponse<IMachine[]>>(this.dataEndpoint, {
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
    console.log(`details ${this.dataEndpoint}/${id}`);

    return this.http
      .get<ApiResponse<IMachine>>(`${this.dataEndpoint}/${id}`, {
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
    console.log(`create ${this.dataEndpoint}`);

    return this.http
      .post<ApiResponse<IMachine>>(this.dataEndpoint, scheme, {
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
    console.log(`update ${this.dataEndpoint}/${machine._id}`);

    return this.http
      .put<ApiResponse<IMachine>>(`${this.dataEndpoint}/${machine._id}`, machine, {
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
    console.log(`delete ${this.dataEndpoint}/${id}`);

    return this.http
      .delete<ApiResponse<boolean>>(`${this.dataEndpoint}/${id}`, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        map((response: any) => response.results as boolean),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  public getWorkRowsFromMachine(id: Id, options?: any): Observable<IHourSchemeRow[] | null> {
    console.log(`getWorkRowsFromMachine ${this.rcmndEnpoint}/${id}`);

    return this.http
      .get<ApiResponse<any>>(`${this.rcmndEnpoint}/${id}/rows`, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        map((response: any) => response.results as IHourSchemeRow[]),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  public getTotalHoursOnMachine(id: Id, options?: any): Observable<number | null> {
    console.log(`getTotalHoursOnMachine ${this.rcmndEnpoint}/${id}/total-hours`);

    return this.http
      .get<ApiResponse<any>>(`${this.rcmndEnpoint}/${id}/total-hours`, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        map((response: any) => response.results as number),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  public getRelatedWorkersFromMachine(id: Id, options?: any): Observable<IUser[] | null> {
    console.log(`getRelatedWorkersFromMachine ${this.rcmndEnpoint}/${id}/workers`);

    return this.http
      .get<ApiResponse<any>>(`${this.rcmndEnpoint}/${id}/workers`, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        map((response: any) => response.results as IUser[]),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  public getRelatedProjectsFromMachine(id: Id, options?: any): Observable<IProject[] | null> {
    console.log(`getRelatedProjectsFromMachine ${this.rcmndEnpoint}/${id}/projects`);

    return this.http
      .get<ApiResponse<any>>(`${this.rcmndEnpoint}/${id}/projects`, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        map((response: any) => response.results as IProject[]),
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
