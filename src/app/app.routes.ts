import {Routes} from '@angular/router';
import {ProjectsComponent} from './layout/projects/projects.component';
import {AddProjectComponent} from './components/add-project/add-project.component';
import {AddIssueComponent} from './components/add-issue/add-issue.component';
import {LoginComponent} from './layout/auth/login/login.component';
import {IssuesComponent} from './layout/issues/issues.component';
import {SecuredAreaComponent} from './layout/secured-area/secured-area.component';
import {AuthComponent} from './layout/auth/auth.component';
import {SignUpComponent} from './layout/auth/sign-up/sign-up.component';
import {authGuard} from './guards/auth-guard.guard';

export const routes: Routes = [
    {
        path: '',
        component: SecuredAreaComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                component: IssuesComponent
            },
            {
                path: 'projects',
                component: ProjectsComponent,
                children: [
                    {
                        path: 'new',
                        component: AddProjectComponent
                    }
                ]
            },
            {
                path: 'new',
                component: AddIssueComponent
            }
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
