import {IssuePriority, IssueState} from '../../../types/issue.types';

export interface IIssueFilterRequest {
    searchTerm?: string;
    state?: IssueState;
    priorities?: IssuePriority[];
    projectIds?: string[];
}
