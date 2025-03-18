import {Component, computed, inject, input} from '@angular/core';
import {IssueService} from '../../services/issue.service';
import {rxResource} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-issue-view',
    imports: [],
    templateUrl: './issue-view.component.html',
})
export class IssueViewComponent {

    private readonly _issueService = inject(IssueService);

    public readonly issueId = input.required<string>();

    private readonly _issueResource = rxResource({
        request: () => ({
            issueId: this.issueId()
        }),
        loader: ({request}) => this._issueService.getIssue(request.issueId)
    });

    protected readonly issue = computed(() => {
        return this._issueResource.value();
    });

}
