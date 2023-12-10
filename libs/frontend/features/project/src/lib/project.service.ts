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
export class ProjectService {
  dataEndpoint = `${environment.dataApiUrl}/api/project`;
  rcmndEndpoint = `${environment.rcmndApiUrl}/api/recommendations/project`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Get all items.
   *
   * @options options - optional URL queryparam options
   */
  public list(options?: any): Observable<IProject[] | null> {
    console.log(`list ${this.dataEndpoint}`);

    return this.http
      .get<ApiResponse<IProject[]>>(this.dataEndpoint, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        map((response: any) => response.results as IProject[]),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  public details(id: Id, options?: any): Observable<IProject | null> {
    console.log(`details ${this.dataEndpoint}/${id}`);

    return this.http
      .get<ApiResponse<IProject>>(`${this.dataEndpoint}/${id}`, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        map((response: any) => response.results as IProject),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  public create(scheme: IProject, options?: any): Observable<IProject | null> {
    console.log(`create ${this.dataEndpoint}`);

    return this.http
      .post<ApiResponse<IProject>>(this.dataEndpoint, scheme, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        map((response: any) => response.results as IProject),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  public update(project: IProject, options?: any): Observable<IProject | null> {
    console.log(`update ${this.dataEndpoint}/${project._id}`);

    return this.http
      .put<ApiResponse<IProject>>(`${this.dataEndpoint}/${project._id}`, project, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        map((response: any) => response.results as IProject),
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

  public getAllWorkersFromProject(id: Id, options?: any): Observable<IUser[] | null> {
    console.log(`getAllWorkersFromProject ${this.rcmndEndpoint}/${id}/workers`);

    return this.http
      .get<ApiResponse<IUser[]>>(
        `${this.rcmndEndpoint}/${id}/workers`, {
        ...options,
        ...httpOptions,
      }
      )
      .pipe(
        map((response: any) => response.results as IUser[]),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  public getAllMachinesFromProject(id: Id, options?: any): Observable<IMachine[] | null> {
    console.log(`getAllMachinesFromProject ${this.rcmndEndpoint}/${id}/machines`);

    return this.http
      .get<ApiResponse<IUser[]>>(
        `${this.rcmndEndpoint}/${id}/machines`, {
        ...options,
        ...httpOptions,
      }
      )
      .pipe(
        map((response: any) => response.results as IMachine[]),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  public getTotalHoursFromProject(id: Id, options?: any): Observable<number | null> {
    console.log(`getTotalHoursFromProject ${this.rcmndEndpoint}/${id}/total-hours`);

    return this.http
      .get<ApiResponse<number>>(
        `${this.rcmndEndpoint}/${id}/total-hours`, {
        ...options,
        ...httpOptions,
      }
      )
      .pipe(
        map((response: any) => response.results as number),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  public getWorkRowsFromProject(id: Id, options?: any): Observable<IHourSchemeRow[] | null> {
    console.log(`getWorkRowsFromProject ${this.rcmndEndpoint}/${id}/rows`);

    return this.http
      .get<ApiResponse<number>>(
        `${this.rcmndEndpoint}/${id}/rows`, {
        ...options,
        ...httpOptions,
      }
      )
      .pipe(
        map((response: any) => response.results as IHourSchemeRow[]),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  /**
   * Handle errors.
   */
  public handleError(error: HttpErrorResponse): Observable<any> {
    console.log(`handleError in ${ProjectService.name}`, error);

    return throwError(() => new Error(error.message));
  }
}
