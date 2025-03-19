import {IssueDataSource} from '../../data-sources/issue.data-source';
import {IssueComponent} from '../../components/issue/issue.component';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {debounceTime} from 'rxjs';
import {IssuePriority, IssueState} from '../../types/issue.types';
import {IIssueFilterRequest} from '../../interfaces/requests/project/issue-filter-request';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatChipListboxChange, MatChipsModule} from '@angular/material/chips';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {ProjectsSelectionComponent} from '../../components/projects-selection/projects-selection.component';
import {MatInputModule} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {PrioritiesSelectionComponent} from '../../components/priority-selection/priorities-selection.component';
import {MatDialog} from '@angular/material/dialog';
import {IssueSortingComponent} from '../../components/issue-sorting/issue-sorting.component';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { IssueCreateComponent } from '../../components/dialogs/issue-create/issue-create.component';
import { IssueService } from '../../services/issue.service';
import { IIssueListResponse } from '../../interfaces/responses/project/issue-list-response';
import { EditIssueComponent } from '../../components/dialogs/edit-issue/edit-issue.component';
import { IIssueRequest } from '../../interfaces/requests/issue-request.interface';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
    selector: 'app-issues',
    imports: [
        IssueComponent,
        MatListModule,
        MatProgressBarModule,
        MatChipsModule,
        MatButtonModule,
        MatMenuModule,
        ProjectsSelectionComponent,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatIcon,
        PrioritiesSelectionComponent,
        IssueSortingComponent,
        MatTooltip
    ],
    templateUrl: './issues.component.html',
    host: {
        class: 'app-layout'
    }
})
export class IssuesComponent {

    private readonly _dialog = inject(MatDialog);

    public readonly dataSource = new IssueDataSource();
    private readonly _issueService = inject(IssueService);
   
    public readonly searchControl = new FormControl<string>(this.dataSource.filterRequest().searchTerm ?? '');
    public readonly selectedState = signal<IssueState>(this.dataSource.filterRequest().state ?? "Open");
    public readonly selectedProjectIds = signal<string[]>(this.dataSource.filterRequest().projectIds ?? []);
    public readonly selectedPriorities = signal<IssuePriority[]>(this.dataSource.filterRequest().priorities ?? []);

    private readonly searchControlChanges = toSignal(this.searchControl.valueChanges.pipe(debounceTime(250)));
    private readonly filterRequest = computed<IIssueFilterRequest>(() => {
        return {
            searchTerm: this.searchControlChanges() ?? '',
            state: this.selectedState(),
            projectIds: this.selectedProjectIds(),
            priorities: this.selectedPriorities(),
        };
    });

    request: IIssueRequest = {
        name: '',
        priority: 0,
        state: 0
    };

    constructor() {
        effect(() => {
            if (!this.filterRequest()) return;
            this.dataSource.changeFilter(this.filterRequest()!);
        });
    }

    public onStateChanged(change: MatChipListboxChange) {
        if (!change.value) return;
        this.selectedState.set(change.value);
    }

    public createIssue() {
        const dialogRef = this._dialog.open(IssueCreateComponent, {
            data: {
                projectId: ''
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (!result) return;
            this.dataSource.reload();
        });
    }

    public editIssue(issue: IIssueListResponse) {
        const dialogRef = this._dialog.open(EditIssueComponent, {
            data: {
                issue: issue
            }
        });

        dialogRef.afterClosed().subscribe((request: IIssueRequest) => {
            if (!request) return;
            this._issueService.editIssue(request, issue.id).subscribe({
                next: data => this.dataSource.reload()
            });
        });
    }

    public deleteIssue(issueId: string) {
        this._issueService.deleteIssue(issueId).subscribe({
            next: data => this.dataSource.reload()
        });
    }

    public closeIssue(issue: IIssueListResponse) {

        if (issue.state == 'Closed') {
            this.editIssueForClose(issue, 0);
        }
        else {
            issue.state = "Open";
            this.editIssueForClose(issue, 1);
        }
    }

    public editIssueForClose(issue: IIssueListResponse, state: number) {
        this.request.name = issue.name;
        switch (issue.priority) {
            case "Minor":
                this.request.priority = 0;
                break;
            case "Normal":
                this.request.priority = 1;
                break;
            case "Major":
                this.request.priority = 2;
                break;
            case "Critical":
                this.request.priority = 3;
                break;
            default:
                this.request.priority = 1;
                break;
        }

        this.request.state = state;

        this._issueService.editIssue(this.request, issue.id).subscribe({
            next: data => this.dataSource.reload()
        });  
    }   
}
