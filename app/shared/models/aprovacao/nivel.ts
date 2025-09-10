import { NivelParticipante } from "./nivel-participante";

export class Nivel{
    public idNivel: number;
    public idPessoaJuridica: number;
    public idDepartamento: number;
    public valor: number;
    public participantes: Array<NivelParticipante>;
}