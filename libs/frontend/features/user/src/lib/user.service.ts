import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  ApiResponse,
  ICreateUser,
  IMachine,
  IProject,
  IUpdateUser,
  IUser,
  Id,
} from '@hour-master/shared/api';
import { environment } from '@hour-master/shared/environments';

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
export class UserService {
  dataEndpoint = `${environment.dataApiUrl}/api/user`;
  rcmndEndpoint = `${environment.rcmndApiUrl}/api/recommendations/worker`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Get all users.
   *
   * @options options - optional URL queryparam options
   */
  public list(options?: any): Observable<IUser[] | null> {
    console.log(`list ${this.dataEndpoint}`);

    return this.http
      .get<ApiResponse<IUser[]>>(this.dataEndpoint, {
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
  public details(id: Id, options?: any): Observable<IUser | null> {
    console.log(`details ${this.dataEndpoint}/${id}`);

    return this.http
      .get<ApiResponse<IUser>>(`${this.dataEndpoint}/${id}`, {
        ...options,
        ...httpOptions,
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
  public update(
    id: Id,
    user: IUpdateUser,
    options?: any
  ): Observable<boolean | null> {
    return this.http
      .patch<ApiResponse<boolean>>(`${this.dataEndpoint}/${id}`, user, {
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
   * Create user.
   *
   * @param user - user to create
   * @param options - optional URL queryparam options
   * @returns Observable<IUser | null>
   */
  public create(user: ICreateUser, options?: any): Observable<IUser | null> {
    return this.http
      .post<ApiResponse<IUser>>(`${this.dataEndpoint}`, user, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        map((response: any) => response.results as IUser),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  public delete(id: Id, options?: any): Observable<boolean | null> {
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

  public getRelatedProjects(id: Id, options?: any): Observable<IProject[] | null> {
    return this.http
      .get<ApiResponse<any>>(`${this.rcmndEndpoint}/${id}/projects`, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        map((response: any) => response.results as IProject[]),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  public getRelatedMachines(id: Id, options?: any): Observable<IMachine[] | null> {
    return this.http
      .get<ApiResponse<any>>(`${this.rcmndEndpoint}/${id}/machines`, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        map((response: any) => response.results as IMachine[]),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  public getRelatedWorkers(id: Id, options?: any): Observable<IUser[] | null> {
    return this.http
      .get<ApiResponse<any>>(`${this.rcmndEndpoint}/${id}/workers`, {
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
   * Handle errors.
   */
  public handleError(error: HttpErrorResponse): Observable<any> {
    console.log('handleError in UserService', error);

    return throwError(() => new Error(error.error.message));
  }
}
