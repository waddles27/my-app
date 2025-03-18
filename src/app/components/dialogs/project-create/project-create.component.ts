import {Component, computed, inject, Signal} from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {ProjectDataSource} from '../../../data-sources/project.data-source';
import { ProjectService } from '../../../services/project.service';

@Component({
  selector: 'app-project-create',
  imports: [
      ReactiveFormsModule,
      MatInputModule,
      MatSelectModule,
      MatDialogModule,
      MatButtonModule
  ],
  templateUrl: './project-create.component.html',
})
export class  ProjectCreateComponent {

    private readonly _projectService = inject(ProjectService);
    private readonly _dialogRef = inject(MatDialogRef<ProjectCreateComponent>);

    public projectDataSource = new ProjectDataSource();

    public readonly isInvalidState: Signal<boolean> = computed(() => {
        return this.createFormStatusChanges() != 'VALID';
    });

    public createForm: FormGroup = new FormGroup({
        code: new FormControl<string>("", [Validators.required]),
        name: new FormControl<string>("", [Validators.required]),
        //description: new FormControl<string>(""),
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

        this._projectService.createProject(this.createForm.value).subscribe({
            next: data => {
                this._dialogRef.close(data.id);
            }
        });
    }

}
