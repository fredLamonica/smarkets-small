export enum StatusHomologacaoTransportadora {
  Homologado = 1,
  NaoHomologado = 2
}

export const StatusHomologacaoTransportadoraLabel: {
  [key in StatusHomologacaoTransportadora]: string;
} = {
  [StatusHomologacaoTransportadora.Homologado]: 'Homologado',
  [StatusHomologacaoTransportadora.NaoHomologado]: 'Não Homologado'
};
