import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {IIssue} from '../interfaces/issue.interface';
import { IIssueRequest } from '../interfaces/requests/issue-request.interface';
import {IPageRequest} from '../interfaces/requests/page-request';
import {ISortRequest} from '../interfaces/requests/sort-request';
import {IPageResponse} from '../interfaces/responses/page-response';
import {IIssueFilterRequest} from '../interfaces/requests/project/issue-filter-request';
import {IIssueListResponse} from '../interfaces/responses/project/issue-list-response';
import { IIssueDetailResponse } from '../interfaces/responses/issue/issue-detail-response.interface';
import { ICreateIssueRequest } from '../interfaces/requests/issue/create-issue-request.interface';

@Injectable({
  providedIn: 'root'
})

export class IssueService {
    private readonly _http = inject(HttpClient);

    private readonly _apiPath = '/api/v1.0/issues';

    public getIssues(pageRequest?: IPageRequest, sortRequest?: ISortRequest, filterRequest?: IIssueFilterRequest):
        Observable<IPageResponse<IIssueListResponse>> {

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
            if (!!filterRequest.state) {
                params = params.append("state", filterRequest.state);
            }
            if (!!filterRequest.priorities) {
                filterRequest.priorities.forEach(priority => {
                    params = params.append("priority", priority);
                })
            }
            if (!!filterRequest.projectIds) {
                filterRequest.projectIds.forEach(priority => {
                    params = params.append("projectId", priority);
                })
            }
        }

        return this._http.get<IPageResponse<IIssueListResponse>>(this._apiPath, {params: params});
    }

    public getIssue(issueId: string): Observable<IIssueDetailResponse> {
        return this._http.get<IIssueDetailResponse>(`${this._apiPath}/${issueId}`);
    }

    public createIssue(request: ICreateIssueRequest): Observable<IIssueListResponse> {
        return this._http.post<IIssueListResponse>(this._apiPath, JSON.stringify(request));
    }

    public editIssue(request: IIssueRequest, issueId: string): Observable<IIssue> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this._http.put<IIssue>(`${this._apiPath}/${issueId}`, JSON.stringify(request), { headers: headers });
    }

    public deleteIssue(issueId: string): Observable<IIssue> {
        return this._http.delete<IIssue>(`${this._apiPath}/${issueId}`);
    }
}
