import { Component, computed, Inject, inject, OnInit, Signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { toSignal } from '@angular/core/rxjs-interop';
import { IProject } from '../../../interfaces/project.interface';
import { IIssueListResponse } from '../../../interfaces/responses/issue/issue-list-response.interface';
import { ProjectDataSource } from '../../../data-sources/project.data-source';
import { IssuePriority } from '../../../types/issue.types';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-edit-issue',
  imports: [
    MatDialogModule,
    MatButton,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './edit-issue.component.html'
})
export class EditIssueComponent {

  private readonly _dialogRef = inject(MatDialogRef<EditIssueComponent>);
  public projectDataSource = new ProjectDataSource();

  public readonly selectablePriorities: IssuePriority[] = [
        "Critical",
        "Major",
        "Normal",
        "Minor"
    ];
  public readonly isInvalidState: Signal<boolean> = computed(() => {
    return this.editFormStatusChanges() != 'VALID';
  });

   public editForm: FormGroup = new FormGroup({
          projectId: new FormControl<string>("", [Validators.required]),
          name: new FormControl<string>("", [Validators.required]),
          priority: new FormControl<IssuePriority>("Normal", [Validators.required]),
          description: new FormControl<string>(""),
      });

  public editFormStatusChanges = toSignal(this.editForm.statusChanges);

  public get code(): FormControl {
    return this.editForm.controls['code'] as FormControl;
  }

  public get name(): FormControl {
    return this.editForm.controls['name'] as FormControl;
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: { issue: IIssueListResponse }) {
    this.editForm.patchValue(this.data.issue);
  }

  public onEdit() {
    if (this.isInvalidState()) return;

    this._dialogRef.close(this.editForm.value);
  }
}
