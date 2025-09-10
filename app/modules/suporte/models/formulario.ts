export class Formulario{
    constructor(public titulo : string, public descricao : string, public anexos: Array<File>){}

    limparCampos(){
        this.titulo = "";
        this.anexos = [];
        this.descricao = "";
        this.titulo = "";
    }
}