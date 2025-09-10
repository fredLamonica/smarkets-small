import { SolicitacaoDocumentoFornecedorArquivo } from "..";

export class SolicitacaoDocumentoFornecedorArquivoDTO{
    public datas : Array<string>;
    public historico : Map<string,Array<SolicitacaoDocumentoFornecedorArquivo>>;
}
