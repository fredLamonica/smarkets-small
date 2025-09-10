export class Departamento{
    public idDepartamento: number;
    public idPessoaJuridica: number;
    public idTenant: number;
    public idDepartamentoPai: number;
    public descricao: string;
    public codigo: string;
    public filhos: Array<Departamento>;

    // constructor(idDepartamento: number,
    //     idPessoaJuridica: number,
    //     idTenant: number,
    //     idDepartamentoPai: number,
    //     descricao: string,
    //     codigo: string,
    //     filhos: Array<Departamento>) {

    //     this.idDepartamento = idDepartamento;
    //     this.idPessoaJuridica = idPessoaJuridica;
    //     this.idTenant = idTenant;
    //     this.idDepartamentoPai = idDepartamentoPai;
    //     this.descricao = descricao;
    //     this.codigo = codigo;
    //     this.filhos = filhos;
    // }
}