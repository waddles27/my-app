import {Component, output, signal} from '@angular/core';
import {IssuePriority} from '../../types/issue.types';
import {ButtonSelectArrowComponent} from '../button-select-arrow/button-select-arrow.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {NgClass} from '@angular/common';

@Component({
    selector: 'app-priorities-selection',
    imports: [
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        ButtonSelectArrowComponent,
        NgClass
    ],
    templateUrl: './priorities-selection.component.html',
    styleUrl: './priorities-selection.component.scss'
})
export class PrioritiesSelectionComponent {

    public change = output<IssuePriority[]>();

    private readonly selectedPriorities = signal<IssuePriority[]>([]);

    public readonly selectablePriorities: IssuePriority[] = [
        "Critical",
        "Major",
        "Normal",
        "Minor"
    ];

    public isSelected(priority: IssuePriority): boolean {
        return this.selectedPriorities().indexOf(priority) > -1;
    }

    public onItemClick(priority: IssuePriority) {
        this.selectedPriorities.update(selectedPriorities => {
            let priorityIdIndex = selectedPriorities.indexOf(priority);
            if (priorityIdIndex >= 0)
                selectedPriorities.splice(priorityIdIndex, 1);
            else
                selectedPriorities.push(priority);
            return selectedPriorities;
        });
        this.change.emit([...this.selectedPriorities()]);
    }

    public priorityClass(priority: IssuePriority) {
        switch (priority) {
            case "Minor":
                return 'app-issue--minor';
            case "Normal":
                return 'app-issue--normal';
            case "Major":
                return 'app-issue--major';
            case "Critical":
                return 'app-issue--critical';
            default:
                return '';
        }
    }
}
