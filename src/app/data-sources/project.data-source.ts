import {computed, inject, ResourceRef, signal} from '@angular/core';
import {Observable, of} from 'rxjs';
import {IProject} from '../interfaces/project.interface';
import {ProjectService} from '../services/project.service';
import {BaseDataSource} from './base.data-source';
import {rxResource} from '@angular/core/rxjs-interop';
import {IPageRequest} from '../interfaces/requests/page-request';
import {ISortRequest} from '../interfaces/requests/sort-request';
import {IProjectFilterRequest} from '../interfaces/requests/project/project-filter-request';
import {IIssue} from '../interfaces/issue.interface';
import {IProjectResponse} from '../interfaces/responses/project/project-response';
import { IProjectRequest } from '../interfaces/requests/project-request.interface';
import { IPageResponse } from '../interfaces/responses/page-response';

export class ProjectDataSource extends BaseDataSource<IProjectResponse, IProjectFilterRequest>{

    private readonly _projectService = inject(ProjectService);

    private readonly _projectResource = rxResource({
        request: () => ({
            pageRequest: this.pageRequest(),
            sortRequest: this.sortRequest(),
            filterRequest: this.filterRequest()
        }),
        loader: ({request}) =>
            this._projectService.getProjects(request.pageRequest, request.sortRequest, request.filterRequest)
    });


    protected override dataResource(): ResourceRef<IPageResponse<IProjectResponse>> {
            return this._projectResource;
        }
    
        protected override defaultFilterRequest(): IProjectFilterRequest {
            return {
                searchTerm: '',
            };
        }
}
