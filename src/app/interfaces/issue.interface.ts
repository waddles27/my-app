import {IssuePriority} from '../enums/issue-priority.enum';

export interface IIssue {
  id: string;
  name: string;
  description: string;
  code: string;
  projectId: string;
  priority: IssuePriority;
}
