import { Usuario, SituacaoCartaResponsabilidadeFornecedor, Arquivo } from '.';

export class CartaResponsabilidadeFornecedor{
    public idCartaResponsabilidadeFornecedor: number;
    public idFornecedor: number;
    public idUsuarioDestinatario: number;
    public usuarioDestinatario: Usuario;
    public idUsuarioRemetente: number;
    public usuarioRemetente: Usuario;    
    public conteudo: string;
    public dataCriacao: Date;
    public situacao: SituacaoCartaResponsabilidadeFornecedor;
    public anexos: Array<Arquivo>;
}
