import {Pipe, PipeTransform} from '@angular/core';
import {IssueSortBy} from '../types/issue.types';

@Pipe({
    name: 'issueSortBy'
})
export class IssueSortByPipe implements PipeTransform {

    transform(sortBy: string): string {
        switch (sortBy) {
            case 'Name': return 'Name';
            case "ProjectCode": return 'Project Code';
            case "Priority": return 'Priority';
            case "CreatedOn": return 'Created On';
            case "ModifiedOn": return 'Last Updated';
            default: return 'Unknown';
        }
    }

}
