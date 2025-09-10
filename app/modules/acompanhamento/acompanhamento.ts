export interface Acompanhamento {
  resetPaginacao();
  obter(termo?: string);
  onScroll(termo?: string, parametrosFiltroAvancado?: any[], objetoFiltro?: any);
  obterFiltroAvancado(parametrosFiltroAvancado: any[], objetoFiltro);
}
