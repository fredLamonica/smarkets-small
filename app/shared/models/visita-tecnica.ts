import { Fornecedor, Usuario, Arquivo } from '.';
import { SituacaoVisitaTecnica } from './enums/situacao-visita-tecnica';

export class VisitaTecnica {
    public idVisitaTecnica: number;
    public idFornecedorRepresentante: number;
    public idGestorFornecedor: number;
    public idFornecedorVisitaTecnica : number;
    public data: Date;
    public representante: Usuario;
    public gestorFornecedor: Usuario;
    public status: SituacaoVisitaTecnica;
    public anexos: Array<Arquivo>;
    public idTenant: number;
}