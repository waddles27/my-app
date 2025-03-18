import {Component, HostBinding, input} from '@angular/core';
import {RelativeTimePipe} from '../../pipes/relative-time.pipe';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { IProjectResponse } from '../../interfaces/responses/project/project-response';
import { MatRipple } from '@angular/material/core';

@Component({
    selector: 'app-project',
    imports: [
        RelativeTimePipe,
        MatTooltipModule,
        MatIcon
    ],
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss'],
    hostDirectives: [
        MatRipple
    ],
    host: {
        class: 'app-project'
    }
})
export class ProjectComponent {

    public readonly project = input.required<IProjectResponse>();

}
