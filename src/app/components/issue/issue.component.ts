import {Component, HostBinding, input} from '@angular/core';
import {RelativeTimePipe} from '../../pipes/relative-time.pipe';
import {MatTooltipModule} from '@angular/material/tooltip';
import { IIssueListResponse } from '../../interfaces/responses/project/issue-list-response';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';

@Component({
    selector: 'app-issue',
    imports: [
        RelativeTimePipe,
        MatTooltipModule,
        MatIconModule
    ],
    templateUrl: './issue.component.html',
    styleUrls: ['./issue.component.scss'],
    hostDirectives: [
        MatRipple
    ],
    host: {
        class: 'app-issue'
    }
})
export class IssueComponent {

    public readonly issue = input.required<IIssueListResponse>();
    public priority: string = 'Normal'

    @HostBinding('class') get class() {
        switch (this.issue().priority) {
            case "Minor":
                this.priority = 'Minor';
                return 'app-issue--minor';
            case "Normal":
                this.priority = 'Normal';
                return 'app-issue--normal';
            case "Major":
                this.priority = 'Major';
                return 'app-issue--major';
            case "Critical":
                this.priority = 'Critical';
                return 'app-issue--critical';
            default:
                return '';
        }
    }

}
