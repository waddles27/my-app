import {IssuePriority} from '../../../types/issue.types';

export interface ICreateIssueRequest {
    projectId: string;
    priority: IssuePriority;
    name: string;
    description: string;
}
