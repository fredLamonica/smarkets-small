import { CustomTableColumn } from "./custom-table-column";
import { Ordenacao } from "./enums/ordenacao";

export class CustomTableSettings {
    public columns: Array<CustomTableColumn>;
    public selection: "none" | "check" | "radio";
    public sortBy: string;
    public order: Ordenacao

    constructor(columns: Array<CustomTableColumn>, selection: "none" | "check" | "radio" = "none", sortBy?: string, order?: Ordenacao) {
        this.columns = columns;
        this.selection = selection;
        this.sortBy = sortBy;
        this.order = order;
    }
}