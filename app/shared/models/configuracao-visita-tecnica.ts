import { TipoQuestao } from './enums/tipo-questao';
import { ImpactoQuestao } from './enums/impacto-questao';

export class ConfiguracaoVisitaTecnica {
    public idConfiguracaoVisitaTecnica: number;
    public tipo: TipoQuestao;
    public questao: string;
    public impacto: ImpactoQuestao;
    public idTenant: number;
}