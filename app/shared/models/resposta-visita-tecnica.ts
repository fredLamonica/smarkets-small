import { TipoQuestao, ImpactoQuestao } from '.';

export class RespostaVisitaTecnica {
    public idRespostaVisitaTecnica?: number;
    public idResultadoVisitaTecnica?: number;
    public pergunta: string;
    public tipo: TipoQuestao;
    public impacto: ImpactoQuestao;
    public resposta: string;
}