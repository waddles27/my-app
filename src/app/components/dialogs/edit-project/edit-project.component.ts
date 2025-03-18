import { Component, computed, Inject, inject, OnInit, Signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { toSignal } from '@angular/core/rxjs-interop';
import { IProject } from '../../../interfaces/project.interface';


@Component({
  selector: 'app-edit-project',
  imports: [
    MatDialogModule,
    MatButton,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './edit-project.component.html'
})
export class EditProjectComponent {

  private readonly _dialogRef = inject(MatDialogRef<EditProjectComponent>);

  public readonly isInvalidState: Signal<boolean> = computed(() => {
    return this.editFormStatusChanges() != 'VALID';
  });

  public editForm: FormGroup = new FormGroup({
    code: new FormControl<string>('', [Validators.required]),
    name: new FormControl<string>('', [Validators.required]),
    //description: new FormControl<string>(''),
  });

  public editFormStatusChanges = toSignal(this.editForm.statusChanges);

  public get code(): FormControl {
    return this.editForm.controls['code'] as FormControl;
  }

  public get name(): FormControl {
    return this.editForm.controls['name'] as FormControl;
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: { proj: IProject }) {
    this.editForm.patchValue(this.data.proj);
  }

  public onEdit() {
    if (this.isInvalidState()) return;

    this._dialogRef.close(this.editForm.value);
  }
}
