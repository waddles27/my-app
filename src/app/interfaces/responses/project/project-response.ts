import { Dayjs } from "dayjs";

export interface IProjectResponse {
    id: string;
    name: string;
    code: string;
    description: string;
    modifiedOn: Dayjs;
    createdOn: Dayjs;
}
