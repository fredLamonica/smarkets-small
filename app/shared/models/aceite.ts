export class Aceite {
    private idUsuario: Number;
    private idFornecedor: Number;
    private idPessoaJuridica: Number;
    private aceita: boolean;

    constructor(idUsuario: Number, idFornecedor: Number, idPessoaJuridica: Number, aceita: boolean) {
        this.idUsuario = idUsuario;
        this.idFornecedor = idFornecedor;
        this.idPessoaJuridica = idPessoaJuridica;
        this.aceita = aceita;
    }
}