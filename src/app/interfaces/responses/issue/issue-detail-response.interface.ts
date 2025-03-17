import {IssuePriority, IssueState} from '../../../types/issue.types';
import {Dayjs} from 'dayjs';

export interface IIssueDetailResponse {
    id: string;
    projectId: string;
    projectCode: string;
    name: string;
    description: string;
    priority: IssuePriority;
    state: IssueState;
    createdOn: Dayjs;
    modifiedOn: Dayjs;
}
