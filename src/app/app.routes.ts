import {Routes} from '@angular/router';
import {ProjectsComponent} from './layout/projects/projects.component';
import { LoginComponent } from './layout/auth/login/login.component';
import { authGuard } from './guards/auth.guard';
import { IssuesComponent } from './layout/issues/issues.component';
import { NavigationComponent } from './navigation/navigation.component';
import { AuthComponent } from './layout/auth/auth.component';
import { SignUpComponent } from './layout/auth/sign-up/sign-up.component';

export const routes: Routes = [
    {
        path: '',
        component: NavigationComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                component: IssuesComponent,
            },
            {
                path: 'projects',
                component: ProjectsComponent,
            },
        ]
    },
    {
        path: 'auth',
        component: AuthComponent,
        children: [
            {
                path: 'sign-in',
                component: LoginComponent
            },
            {
                path: 'sign-up',
                component: SignUpComponent
            }
        ]
    }
];
