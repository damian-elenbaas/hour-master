import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ApiResponse, IProject, Id } from '@hour-master/shared/api';
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
  endpoint = `${environment.dataApiUrl}/api/project`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Get all items.
   *
   * @options options - optional URL queryparam options
   */
  public list(options?: any): Observable<IProject[] | null> {
    console.log(`list ${this.endpoint}`);

    return this.http
      .get<ApiResponse<IProject[]>>(this.endpoint, {
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
    console.log(`details ${this.endpoint}/${id}`);

    return this.http
      .get<ApiResponse<IProject>>(`${this.endpoint}/${id}`, {
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
    console.log(`create ${this.endpoint}`);

    return this.http
      .post<ApiResponse<IProject>>(this.endpoint, scheme, {
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
    console.log(`update ${this.endpoint}/${project._id}`);

    return this.http
      .put<ApiResponse<IProject>>(`${this.endpoint}/${project._id}`, project, {
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
    console.log(`handleError in ${ProjectService.name}`, error);

    return throwError(() => new Error(error.message));
  }
}
