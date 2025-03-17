import {Component, computed, inject, Signal} from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-create-project',
  imports: [
    MatDialogModule,
    MatButton,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './create-project.component.html'
})
export class CreateProjectComponent {
  private readonly _dialogRef = inject(MatDialogRef<CreateProjectComponent>);

  public readonly isInvalidState: Signal<boolean> = computed(() => {
    return this.createFormStatusChanges() != 'VALID';
  });

  public createForm: FormGroup = new FormGroup({
    code: new FormControl<string>("", [Validators.required]),
    name: new FormControl<string>("", [Validators.required]),
    description: new FormControl<string>(""),
  });

  public createFormStatusChanges = toSignal(this.createForm.statusChanges);

  public get code(): FormControl {
    return this.createForm.controls['code'] as FormControl;
  }

  public get name(): FormControl {
    return this.createForm.controls['name'] as FormControl;
  }

  public onCreate() {
    if (this.isInvalidState()) return;

    this._dialogRef.close(this.createForm.value);
  }
}
