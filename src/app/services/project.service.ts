import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IProject} from '../interfaces/project.interface';
import {IProjectRequest} from '../interfaces/requests/project-request.interface';
import {IPageResponse} from '../interfaces/responses/page-response';
import {IProjectResponse} from '../interfaces/responses/project/project-response';
import {IPageRequest} from '../interfaces/requests/page-request';
import {ISortRequest} from '../interfaces/requests/sort-request';
import {IProjectFilterRequest} from '../interfaces/requests/project/project-filter-request';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly _http = inject(HttpClient);

  private readonly _apiPath = '/api/v1.0/projects';
  public getProjects(pageRequest?: IPageRequest, sortRequest?: ISortRequest, filterRequest?: IProjectFilterRequest):
    Observable<IPageResponse<IProjectResponse>> {

    let params = new HttpParams();

    if (!!pageRequest) {
      params = params.append("pageNumber", pageRequest.pageNumber);
      params = params.append("pageSize", pageRequest.pageSize);
    }

    if (!!sortRequest) {
      params = params.append("sortBy", sortRequest.sortBy);
      params = params.append("sortDir", sortRequest.sortDir);
    }

    if (!!filterRequest) {
      if (!!filterRequest.searchTerm) {
        params = params.append("searchTerm", filterRequest.searchTerm);
      }
    }

    return this._http.get<IPageResponse<IProjectResponse>>(this._apiPath, { params: params });
  }

  public createProject(request: IProjectRequest): Observable<IProject> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post<IProject>(this._apiPath, JSON.stringify(request), { headers: headers });
  }

  public editProject(request: IProjectRequest, projectId: string): Observable<IProject> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this._http.put<IProject>(`${this._apiPath}/${projectId}`, JSON.stringify(request), {headers: headers});
  }

  public deleteProject(projectId: string): Observable<IProject> {
    return this._http.delete<IProject>(`${this._apiPath}/${projectId}`);
  }

}
