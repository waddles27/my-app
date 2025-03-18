import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { IssueCreateComponent } from '../../components/dialogs/issue-create/issue-create.component';
import { ProjectService } from '../../services/project.service';
import { ProjectDataSource } from '../../data-sources/project.data-source';
import { IProjectFilterRequest } from '../../interfaces/requests/project/project-filter-request';
import { IProject } from '../../interfaces/project.interface';
import { EditProjectComponent } from '../../components/dialogs/edit-project/edit-project.component';
import { IProjectRequest } from '../../interfaces/requests/project-request.interface';
import { ProjectCreateComponent } from '../../components/dialogs/project-create/project-create.component';
import { ProjectComponent } from "../../components/project/project.component";
import { MatRipple} from '@angular/material/core';
import { MatPaginatorModule} from '@angular/material/paginator';

@Component({
  selector: 'app-projects',
  imports: [
    MatListModule,
    MatProgressBarModule,
    MatChipsModule,
    MatButtonModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIcon,
    MatRipple,
    ProjectComponent,
    MatPaginatorModule
],
  templateUrl: './projects.component.html',
  host: {
    class: 'app-layout'
  }
})
export class ProjectsComponent {
  private readonly _projectService = inject(ProjectService);
  private readonly _dialog = inject(MatDialog);
  public dataSource = new ProjectDataSource();

  public readonly searchControl = new FormControl<string>(this.dataSource.filterRequest().searchTerm ?? '');
  private readonly searchControlChanges = toSignal(this.searchControl.valueChanges.pipe(debounceTime(250)));
  private readonly filterRequest = computed<IProjectFilterRequest>(() => {
    return {
      searchTerm: this.searchControlChanges() ?? '',
    };
  });

  constructor() {
    effect(() => {
      if (!this.filterRequest()) return;
      this.dataSource.changeFilter(this.filterRequest()!);
    });
  }

  public editProject(project: IProject) {
    const dialogRef = this._dialog.open(EditProjectComponent, {
      data: {
        proj: project
      }
    });

    dialogRef.afterClosed().subscribe((request: IProjectRequest) => {
      if(!request) return;
      this._projectService.editProject(request, project.id).subscribe({
        next: data => this.dataSource.reload()
      });
    });
  }
 
  public createIssue(projectId: string) {

    const dialogRef = this._dialog.open(IssueCreateComponent, {
      data: {
          projectId : projectId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.dataSource.reload();
    });
  }

  public createProject() {
    const dialogRef = this._dialog.open(ProjectCreateComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.dataSource.reload();
    });
  }

  public deleteProject(projectId: string){
    this._projectService.deleteProject(projectId).subscribe({
      next: data => this.dataSource.reload()
    });
  }
}


