import {Component, effect, input, linkedSignal, output, signal} from '@angular/core';
import {ISortRequest} from '../../interfaces/requests/sort-request';
import {IssueSortBy} from '../../types/issue.types';
import {ButtonSelectArrowComponent} from '../button-select-arrow/button-select-arrow.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatDivider} from '@angular/material/divider';
import {IssueSortByPipe} from '../../pipes/issue-sort-by.pipe';

@Component({
    selector: 'app-issue-sorting',
    imports: [
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        ButtonSelectArrowComponent,
        MatDivider,
        IssueSortByPipe,
    ],
    templateUrl: './issue-sorting.component.html',
})
export class IssueSortingComponent {

    public sort = input.required<ISortRequest>();
    public change = output<ISortRequest>();

    public readonly sortBy = linkedSignal<string>(() => this.sort().sortBy);
    public readonly sortDir = linkedSignal<'asc' | 'desc'>(() => this.sort().sortDir);

    public readonly ascLabel = signal<string>('Ascending');
    public readonly descLabel = signal<string>('Descending');

    public readonly sortVariants: IssueSortBy[] = [
        "Name",
        "ProjectCode",
        "Priority",
        "CreatedOn",
        "ModifiedOn",
    ];

    constructor() {
        effect(() => {
            this.change?.emit({
                sortBy: this.sortBy(),
                sortDir: this.sortDir(),
            });
        })

        effect(() => {
            if (this.sortBy() === 'CreatedOn' || this.sortBy() === 'ModifiedOn') {
                this.ascLabel.set('Oldest');
                this.descLabel.set('Newest');
            } else {
                this.ascLabel.set('Ascending');
                this.descLabel.set('Descending');
            }
        })
    }

}
