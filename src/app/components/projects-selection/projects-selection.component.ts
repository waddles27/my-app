import {Component, output, signal} from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {ButtonSelectArrowComponent} from '../button-select-arrow/button-select-arrow.component';
import {ProjectDataSource} from '../../data-sources/project.data-source';
import {MatIconModule} from '@angular/material/icon';

@Component({
    selector: 'app-projects-selection',
    imports: [
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        ButtonSelectArrowComponent
    ],
    templateUrl: './projects-selection.component.html',
    styleUrl: './projects-selection.component.scss'
})
export class ProjectsSelectionComponent {

    public change = output<string[]>();

    public dataSource = new ProjectDataSource();

    private readonly selectedIds = signal<string[]>([]);

    public isSelected(projectId: string): boolean {
        return this.selectedIds().indexOf(projectId) > -1;
    }

    public onItemClick(projectId: string) {
        this.selectedIds.update(selectedIds => {
            let projectIdIndex = selectedIds.indexOf(projectId);
            if (projectIdIndex >= 0)
                selectedIds.splice(projectIdIndex, 1);
            else
                selectedIds.push(projectId);
            return selectedIds;
        });
        this.change.emit([...this.selectedIds()]);
    }

}
