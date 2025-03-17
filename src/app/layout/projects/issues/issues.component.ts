import {Component, computed, effect, inject, input, OnInit, resource, signal} from '@angular/core';
import {IssueDataSource} from '../../../data-sources/issue.data-source';
import {AsyncPipe} from '@angular/common';
import {IssueComponent} from '../../../components/issue/issue.component';
import {IssueService} from '../../../services/issue.service';
import {IIssue} from '../../../interfaces/issue.interface';
import {firstValueFrom, of} from 'rxjs';
import {MatButton} from '@angular/material/button';
import {rxResource} from '@angular/core/rxjs-interop';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
    selector: 'app-issues',
    imports: [
        AsyncPipe,
        IssueComponent,
        MatButton,
        MatProgressSpinner
    ],
    templateUrl: './issues.component.html',
    host: {
        'class': 'issue-list'
    }
})
export class IssuesComponent {

    private readonly _issueService = inject(IssueService);

    public readonly projectId = input.required<string>();

    // public readonly issueDataSource = new IssueDataSource(this.projectId)

}
