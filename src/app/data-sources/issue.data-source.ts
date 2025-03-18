import {inject, ResourceRef} from '@angular/core';
import {IssueService} from '../services/issue.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {BaseDataSource} from './base.data-source';
import {IIssueFilterRequest} from '../interfaces/requests/project/issue-filter-request';
import {IPageResponse} from '../interfaces/responses/page-response';
import { IIssueListResponse } from '../interfaces/responses/project/issue-list-response';

export class IssueDataSource extends BaseDataSource<IIssueListResponse, IIssueFilterRequest> {

    private readonly _issueService = inject(IssueService);

    private readonly _issuesResource = rxResource({
        request: () => ({
            pageRequest: this.pageRequest(),
            sortRequest: this.sortRequest(),
            filterRequest: this.filterRequest(),
        }),
        loader: ({request}) =>
            this._issueService.getIssues(request.pageRequest, request.sortRequest, request.filterRequest)
    });

    protected override dataResource(): ResourceRef<IPageResponse<IIssueListResponse>> {
        return this._issuesResource;
    }

    protected override defaultFilterRequest(): IIssueFilterRequest {
        return {
            searchTerm: '',
            state: "Open",
            projectIds: [],
            priorities: []
        };
    }
}
