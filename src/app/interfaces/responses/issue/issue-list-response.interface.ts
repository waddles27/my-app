import {IssuePriority, IssueState} from '../../../types/issue.types';
import {Dayjs} from 'dayjs';

export interface IIssueListResponse {
    id: string;
    projectId: string;
    projectCode: string;
    name: string;
    priority: IssuePriority;
    state: IssueState;
    createdOn: Dayjs;
    modifiedOn: Dayjs;
}
