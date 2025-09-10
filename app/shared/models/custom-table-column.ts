import { CustomTableColumnType } from "./enums/custom-table-column-type";

export class CustomTableColumn {
    public title: string;
    public property: string;
    public type: CustomTableColumnType;
    public pipe: any;
    public pipeFormat: string;
    public enumType: any;
    public sortProperty: string;

    constructor(title: string, property: string, type: CustomTableColumnType, pipe?: string, pipeFormat?: string, enumType?: any, sortProperty?: string) {
        this.title = title;
        this.property = property;
        this.type = type;
        this.pipe = pipe;
        this.pipeFormat = pipeFormat;
        this.enumType = enumType;
        this.sortProperty = sortProperty;
    }
}