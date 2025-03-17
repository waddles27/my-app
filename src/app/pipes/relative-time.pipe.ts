import {Pipe, PipeTransform} from '@angular/core';
import dayjs, {Dayjs} from 'dayjs';

@Pipe({
    name: 'relativeTime'
})
export class RelativeTimePipe implements PipeTransform {

    transform(value?: Dayjs): string {

        if (!value) return 'N/A';

        return dayjs(value).fromNow();
    }

}
