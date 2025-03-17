import {Component, HostBinding, input} from '@angular/core';
import {IIssue} from '../../interfaces/issue.interface';
import {IssuePriority} from '../../enums/issue-priority.enum';
import {MatRipple} from '@angular/material/core';
import {RelativeTimePipe} from '../../pipes/relative-time.pipe';
import {MatTooltipModule} from '@angular/material/tooltip';
import {IIssueListResponse} from '../../interfaces/responses/issue/issue-list-response.interface';

@Component({
    selector: 'app-issue',
    imports: [
        RelativeTimePipe,
        MatTooltipModule
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

    @HostBinding('class') get class() {
        switch (this.issue().priority) {
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
