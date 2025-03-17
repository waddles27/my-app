import {Component, computed, inject, Signal} from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {IssueService} from '../../../services/issue.service';
import {IssuePriority} from '../../../types/issue.types';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {ProjectDataSource} from '../../../data-sources/project.data-source';

@Component({
  selector: 'app-issue-create',
  imports: [
      ReactiveFormsModule,
      MatInputModule,
      MatSelectModule,
      MatDialogModule,
      MatButtonModule
  ],
  templateUrl: './issue-create.component.html',
  styleUrl: './issue-create.component.scss'
})
export class IssueCreateComponent {

    private readonly _issueService = inject(IssueService);
    private readonly _dialogRef = inject(MatDialogRef<IssueCreateComponent>);

    public projectDataSource = new ProjectDataSource();

    public readonly selectablePriorities: IssuePriority[] = [
        "Critical",
        "Major",
        "Normal",
        "Minor"
    ];

    public readonly isInvalidState: Signal<boolean> = computed(() => {
        return this.createFormStatusChanges() != 'VALID';
    });

    public createForm: FormGroup = new FormGroup({
        projectId: new FormControl<string>("", [Validators.required]),
        name: new FormControl<string>("", [Validators.required]),
        priority: new FormControl<IssuePriority>("Normal", [Validators.required]),
        description: new FormControl<string>(""),
    });

    public createFormStatusChanges = toSignal(this.createForm.statusChanges);

    public get name(): FormControl {
        return this.createForm.controls['name'] as FormControl;
    }

    public onCancel() {
        this._dialogRef.close();
    }

    public onCreate() {
        if (this.isInvalidState()) return;

        this._issueService.createIssue(this.createForm.value).subscribe({
            next: data => {
                this._dialogRef.close(data.id);
            }
        });
    }

}
