import { Usuario, RespostaVisitaTecnica, Arquivo } from '.';

export class ResultadoVisitaTecnica {
    public idResultadoVisitaTecnica: number;
    public idVisitaTecnica: number;
    public idUsuarioFinalizou?: number;
    public respostas: Array<RespostaVisitaTecnica>;
    public dataInicioVisita?: Date;
    public dataFimVisita?: Date;
    public usuarioFinalizou: Usuario;
    public anexos: Array<Arquivo>;
}