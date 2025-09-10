export enum SituacaoUsuario {
    Liberado = 1,
    Bloqueado = 2,
    BloqueadoPorExcessoTentativas = 3
}

export const SituacaoUsuarioLabel = new Map<number, string>([
    [1,'Liberado'],
    [2, 'Bloqueado'],
    [3,'Bloqueado por execesso de tentativas']
]);