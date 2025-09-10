import { CategoriaNaturezaJuridica } from "./enums/categoria-natureza-juridica";

export class NaturezaJuridica {
    public idNaturezaJuridica: number;
    public codigo: string;
    public descricao: string;
    public categoria: CategoriaNaturezaJuridica;

    constructor(
        idNaturezaJuridica: number
        , codigo: string
        , descricao: string
        , categoria: CategoriaNaturezaJuridica
    ) {
        this.idNaturezaJuridica = idNaturezaJuridica;
        this.codigo = codigo;
        this.descricao = descricao;
        this.categoria = categoria;
    }
}