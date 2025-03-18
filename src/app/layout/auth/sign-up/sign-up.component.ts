 import {Component, computed, inject, Signal} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-sign-up',
    imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        RouterLink,
    ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

    private readonly _authService = inject(AuthService);

    public readonly isInvalidState: Signal<boolean> = computed(() => {
        return this.formStatusChanges() != 'VALID';
    });

    public signUpForm: FormGroup = new FormGroup({
        email: new FormControl<string>("", [Validators.required, Validators.email]),
        password: new FormControl<string>("", [Validators.required]),
        username: new FormControl<string>("", [Validators.required]),
    });

    public formStatusChanges = toSignal(this.signUpForm.statusChanges);

    public get email(): FormControl {
        return this.signUpForm.controls['email'] as FormControl;
    }

    public get password(): FormControl {
        return this.signUpForm.controls['password'] as FormControl;
    }

    public get username(): FormControl {
        return this.signUpForm.controls['username'] as FormControl;
    }

    public signUp() {
        if (this.isInvalidState()) return;

        this._authService.signUp(this.signUpForm.value).subscribe({
            error: error => {
                console.log(error);
            }
        });
    }

}
