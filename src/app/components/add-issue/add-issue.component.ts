import {Component, computed, inject, input, Signal} from '@angular/core';
import {ProjectService} from '../../services/project.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {MatInputModule} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {IssueService} from '../../services/issue.service';

@Component({
  selector: 'app-add-issue',
  imports: [
      ReactiveFormsModule,
      MatInputModule,
      MatButton
  ],
  templateUrl: './add-issue.component.html'
})
export class AddIssueComponent {
    private readonly _issueService = inject(IssueService);
    private readonly _router = inject(Router);

    public readonly projectId = input.required<string>()

    public readonly isInvalidState: Signal<boolean> = computed(() => {
        return this.createFormStatusChanges() != 'VALID';
    });

    public createForm: FormGroup = new FormGroup({
        name: new FormControl<string>("", [Validators.required]),
        description: new FormControl<string>(""),
    });

    public createFormStatusChanges = toSignal(this.createForm.statusChanges);

    public get name(): FormControl {
        return this.createForm.controls['name'] as FormControl;
    }

    public onCreate() {
        if (this.isInvalidState()) return;

        // this._issueService.createIssue(this.projectId(), this.createForm.value).subscribe({
        //     next: data => {
        //         let issueUrl = this._router.createUrlTree([this.projectId()]);
        //         this._router.navigateByUrl(issueUrl).then(r => {});
        //     }
        // });
    }
}
