import {Component} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {RouterOutlet} from '@angular/router';

@Component({
    selector: 'app-auth',
    imports: [
        RouterOutlet,
        MatIcon
    ],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss'
})
export class AuthComponent {

}
