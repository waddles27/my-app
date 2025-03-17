import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {IssueService} from '../services/issue.service';
import {firstValueFrom} from 'rxjs';

export const noIssuesGuard: CanActivateFn = async (route, state) => {

  const issueService = inject(IssueService);
  const router = inject(Router);

  const projectId = route.params['projectId'];

  let issues = await firstValueFrom(issueService.getIssues(projectId));

  if (issues.length == 0)
    return router.createUrlTree([projectId, 'new']);

  return true;
};
