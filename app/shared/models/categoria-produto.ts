import { ClassificacaoCategoriaProduto } from './enums/classificacao-categoria-produto';
import { TipoCategoriaProduto } from './enums/tipo-categoria-produto';

export class CategoriaProduto {
    public idCategoriaProduto: number;
    public idCategoriaProdutoPai: number;
    public codigo: string;
    public nome: string;
    public situacao: boolean;
    public classificacao: ClassificacaoCategoriaProduto;
    public tipo: TipoCategoriaProduto;
    public classeIcone: string;
    public filhos: Array<CategoriaProduto>;
    public idTenant: number;
    public idCnae: number;
    public regulamentacao: boolean;

    constructor(
        idCategoriaProduto: number, 
        idCategoriaProdutoPai: number, 
        codigo: string, 
        nome: string, 
        situacao: boolean, 
        classificacao: ClassificacaoCategoriaProduto, 
        tipo: TipoCategoriaProduto,
        classeIcone: string,
        filhos: Array<CategoriaProduto>,
        idTenant: number,
        idCnae: number,
        regulamentacao: boolean
    ) {
        this.idCategoriaProduto = idCategoriaProduto;
        this.idCategoriaProdutoPai = idCategoriaProdutoPai;
        this.codigo = codigo;
        this.nome = nome;
        this.situacao = situacao;
        this.classificacao = classificacao;
        this.tipo = tipo;
        this.filhos = filhos;
        this.idTenant = idTenant;
        this.idCnae = idCnae;
        this.classeIcone = classeIcone;
        this.regulamentacao = regulamentacao;
    }
}