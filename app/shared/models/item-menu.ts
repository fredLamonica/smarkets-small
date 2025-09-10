export class ItemMenu {
    public nome: string;
    public icone: string;
    public rota: string;
    public queryParams: any;
    public subItens: Array<ItemMenu>;

    constructor(nome: string, icone: string, rota: string, queryParams: any, subItens: Array<ItemMenu>) {
        this.nome = nome;
        this.icone = icone;
        this.rota = rota;
        this.queryParams = queryParams;
        this.subItens = subItens;
    }
}