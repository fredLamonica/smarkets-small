import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cotacao, CotacaoItem, CotacaoMapaComparativoPorItem, CotacaoParticipante, CotacaoRodada, CotacaoTramite, Moeda, Paginacao, Pedido, PedidoGeradoDto, TipoFrete } from '@shared/models';
import { CustomCurrencyPipe } from '@shared/pipes/custom-currency.pipe';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CotacaoAvancadoFiltro } from '../models/fltros/cotacao-avancado-filtro';
import { CotacaoSimplesFiltro } from '../models/fltros/cotacao-simples-filtro';

@Injectable()
export class CotacaoService {
  private API_URL: string = environment.apiUrl;

  constructor(private httpClient: HttpClient, private customCurrencyPipe: CustomCurrencyPipe) { }

  obter(
    cotacaoSimplesFiltro: CotacaoSimplesFiltro,
  ): Observable<Paginacao<Cotacao>> {
    return this.httpClient.post<Paginacao<Cotacao>>(
      `${this.API_URL}cotacoes/filtro`,
      cotacaoSimplesFiltro,
    );
  }

  obterFiltroAvancado(
    cotacaoAvancadoFiltro: CotacaoAvancadoFiltro,
  ): Observable<Paginacao<Cotacao>> {
    return this.httpClient.post<Paginacao<Cotacao>>(
      `${this.API_URL}cotacoes/filtroAvancado`,
      cotacaoAvancadoFiltro,
    );
  }

  listar(): Observable<Array<Cotacao>> {
    return this.httpClient.get<Array<Cotacao>>(`${this.API_URL}cotacoes`);
  }

  obterPorId(idCotacao: number): Observable<Cotacao> {
    return this.httpClient.get<Cotacao>(`${this.API_URL}cotacoes/${idCotacao}`);
  }

  obterCotacao(idCotacao: number): Observable<Cotacao> {
    return this.httpClient.get<Cotacao>(`${this.API_URL}cotacoes/obtenha-cotacao/${idCotacao}`);
  }

  obtenhaMapaComparativo(idCotacao: number): Observable<Cotacao> {
    return this.httpClient.get<Cotacao>(`${this.API_URL}cotacoes/mapa-comparativo/${idCotacao}`);
  }

  inserir(cotacao: Cotacao): Observable<Cotacao> {
    return this.httpClient.post<Cotacao>(`${this.API_URL}cotacoes`, cotacao);
  }

  alterar(cotacao: Cotacao): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}cotacoes`, cotacao);
  }

  alterarItem(cotacaoItem: CotacaoItem): Observable<number> {
    return this.httpClient.patch<number>(`${this.API_URL}cotacoes/cotacaoItem`, cotacaoItem);
  }

  excluir(idCotacao: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}cotacoes/${idCotacao}`);
  }

  aceitarTermos(idCotacao: number): Observable<number> {
    return this.httpClient.post<number>(`${this.API_URL}cotacoes/${idCotacao}/aceites`, null);
  }

  cancelar(idCotacao: number): Observable<number> {
    return this.httpClient.put<number>(`${this.API_URL}cotacoes/cancelar/${idCotacao}`, null);
  }

  assumir(idCotacao: number): Observable<number> {
    return this.httpClient.patch<number>(`${this.API_URL}cotacoes/assumir/${idCotacao}`, null);
  }

  // #region Itens

  obterItensPorCotacao(idCotacao: number): Observable<Array<CotacaoItem>> {
    return this.httpClient.get<Array<CotacaoItem>>(`${this.API_URL}cotacoes/${idCotacao}/itens`);
  }

  // #endregion

  // #region Tramites

  agendar(idCotacao: number): Observable<CotacaoRodada> {
    return this.httpClient.post<CotacaoRodada>(
      `${this.API_URL}cotacoes/agendadas/${idCotacao}`,
      null,
    );
  }

  encerrar(idCotacao: number): Observable<CotacaoTramite> {
    return this.httpClient.post<CotacaoTramite>(
      `${this.API_URL}cotacoes/encerradas/${idCotacao}`,
      null,
    );
  }

  encerrarRequisicaoItem(
    itensRetornar: Array<CotacaoItem>,
    itensFinalizar: Array<CotacaoItem>,
  ): Observable<CotacaoTramite> {
    return this.httpClient.post<CotacaoTramite>(
      `${this.API_URL}cotacoes/requisicaoItemEncerradas`,
      {
        itensRetornar: itensRetornar,
        itensFinalizar: itensFinalizar,
      },
    );
  }

  retornarCotacaoParaAnalise(idCotacao: number): Observable<CotacaoTramite> {
    return this.httpClient.post<CotacaoTramite>(
      `${this.API_URL}cotacoes/retornarParaAnalise/${idCotacao}`,
      null,
    );
  }
  // #endregion

  // #region Participantes

  insiraParticipante(cotacaoParticipante: CotacaoParticipante): Observable<CotacaoParticipante> {
    return this.httpClient.post<CotacaoParticipante>(`${this.API_URL}cotacoes/participante`, cotacaoParticipante);
  }

  deleteParticipante(idCotacaoParticipante: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.API_URL}cotacoes/participante/${idCotacaoParticipante}`);
  }

  // #endregion

  // #region Pedidos
  gerarPedidos(
    idCotacao: number,
    pedidos: Array<Pedido>,
  ): Observable<Array<PedidoGeradoDto>> {
    return this.httpClient.post<Array<PedidoGeradoDto>>(
      `${this.API_URL}cotacoes/${idCotacao}/pedidos`,
      pedidos,
    );
  }
  // #endregion

  //#region Log visualização
  marcarVisualizacao(idCotacao: number): Observable<number> {
    return this.httpClient.post<number>(
      `${this.API_URL}cotacoes/${idCotacao}/visualizar`,
      idCotacao,
    );
  }
  //#endregion

  gerarRelatorioAnalise(idCotacao: number): Observable<any> {
    return this.httpClient.get(`${this.API_URL}cotacoes/relatorioAnalise/${idCotacao}`, {
      responseType: 'blob',
    });
  }

  // #region Mapa Comparativo

  obterMapaComparativoPorItem(idCotacao: number): Observable<CotacaoMapaComparativoPorItem> {
    return this.httpClient.get<CotacaoMapaComparativoPorItem>(
      `${this.API_URL}cotacoes/${idCotacao}/MapaComparativoPorItem`,
    );
  }

  gerarPdfMapaComparativoPorItem(
    cotacaoMapaComparativoPorItem: CotacaoMapaComparativoPorItem,
  ) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });

    const duracaoTotal = moment.duration(
      (moment(cotacaoMapaComparativoPorItem.dataFim).unix() -
        moment(cotacaoMapaComparativoPorItem.dataInicio).unix()) *
      1000,
      'milliseconds',
    );
    const tempoTotal = {
      dias: duracaoTotal.days(),
      horas: duracaoTotal.hours(),
      minutos: duracaoTotal.minutes(),
      segundos: duracaoTotal.seconds(),
    };

    const dataHoraRelatorio = moment();

    const greenRgb: [63, 189, 127] = [63, 189, 127];
    const redRgb: [243, 21, 21] = [243, 21, 21];

    const darkBlueRgb: [0, 124, 161] = [0, 124, 161];
    const textBlueRgb: [63, 156, 184] = [63, 156, 184];
    const blueRgb: [255, 255, 255] = [255, 255, 255];
    const whiteRgb: [255, 255, 255] = [255, 255, 255];

    const grayRgb: [110, 110, 114] = [110, 110, 114];
    const borderColorRgb: [255, 255, 255] = [255, 255, 255];
    const fontSize: 8 = 8;

    const tableStyle = {
      lineColor: borderColorRgb,
      lineWidth: 0.03,
      fontSize: fontSize,
      textColor: grayRgb,
    };

    const tableHeadStyle = { fillColor: darkBlueRgb, fontSize: fontSize, textColor: whiteRgb };

    const tableAlternateRowStyle = { fillColor: blueRgb, fontStyle: 'bold' };

    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    const marginX = 15;
    const marginY = 20;
    let finalY = null;

    const defaultTableWidth = pageWidth - (marginX + marginY) + 5;

    const addHeader = () => {
      finalY = marginY;

      doc.setFontSize(8);
      doc.setFontType('bold');
      doc.setTextColor(0, 124, 161);
      doc.text(marginX, finalY + 10, `Mapa da Cotação ${cotacaoMapaComparativoPorItem.idCotacao}`);
      doc.text(
        marginX + 308,
        finalY + 10,
        `Relatório gerado em: ${dataHoraRelatorio.format('DD/MM/YYYY HH:mm')}`,
      );
      doc.setLineWidth(0.5);
      doc.setDrawColor(142, 169, 219);
      doc.line(marginX, finalY + 12, pageWidth - marginX, finalY + 12);
      finalY = finalY + 12;
    };

    const addTitle = (text: string) => {
      if (finalY + 22 > pageHeight - marginY - 60) {
        doc.addPage();
        startPage();
      }

      doc.setFontSize(fontSize);
      doc.setFontType('bold');
      doc.setTextColor(0, 124, 161);
      doc.text(marginX, finalY + 20, text);
      doc.setLineWidth(0.5);
      doc.setDrawColor(142, 169, 219);
      doc.line(marginX, finalY + 22, pageWidth - marginX, finalY + 22);
      finalY = finalY + 22;
    };

    doc.page = 0;
    const totalPagesExp = '{total_pages_count_string}';
    const addFooter = () => {
      let str = 'Página ' + doc.page;
      if (typeof doc.putTotalPages === 'function') {
        str = str + ' de ' + totalPagesExp;
      }
      doc.setFontSize(8);
      doc.setTextColor(0, 124, 161);
      doc.setFontType('normal');
      doc.text(str, marginX, pageHeight - marginY);
    };

    const startPage = () => {
      doc.page++;
      addHeader();
      addFooter();
    };

    const addPageIfNecessary = (extra: number = 60) => {
      if (finalY + 22 > pageHeight - marginY - extra) {
        doc.addPage();
        startPage();
      }
    };

    const tableDidDrawTable = (data) => {
      if (data.pageCount === 1) {
        data.settings.margin.top = marginY + 24;
      } else {
        startPage();
      }
    };

    startPage();

    // #region 1. Dados da Cotação
    addTitle('1. Dados da Cotação');

    const bodyDadosCotacao: any[] = [
      ['Empresa:', cotacaoMapaComparativoPorItem.empresa.razaoSocial, null, null],
      ['CNPJ:', cotacaoMapaComparativoPorItem.empresa.cnpj, null, null],
      [
        'Responsável:',
        cotacaoMapaComparativoPorItem.usuarioResponsavel.pessoaFisica.nome,
        null,
        null,
      ],
      [null, cotacaoMapaComparativoPorItem.usuarioResponsavel.email, null, null],
      [
        null,
        cotacaoMapaComparativoPorItem.usuarioResponsavel.telefone
          ? cotacaoMapaComparativoPorItem.usuarioResponsavel.telefone
          : '--',
        null,
        null,
      ],
      ['Descrição:', cotacaoMapaComparativoPorItem.descricao, null, null],
      [
        'Data Inicio:',
        moment(cotacaoMapaComparativoPorItem.dataInicio).format('DD/MM/YYYY HH:mm'),
        'Data Fim:',
        moment(cotacaoMapaComparativoPorItem.dataFim).format('DD/MM/YYYY HH:mm'),
      ],
      [
        'Tempo Total:',
        `${tempoTotal.dias}d ${tempoTotal.horas}h ${tempoTotal.minutos}m ${tempoTotal.segundos}s`,
        null,
        null,
      ],
    ];

    doc.autoTable({
      startY: finalY + 4,
      body: bodyDadosCotacao,
      bodyStyles: { fillColor: whiteRgb },
      margin: { left: marginX, right: marginX },
      styles: tableStyle,
      columnStyles: {
        0: {
          cellWidth: 60,
          fillColor: darkBlueRgb,
          fontStyle: 'bold',
          textColor: whiteRgb,
        },
      },
      alternateRowStyles: tableAlternateRowStyle,
      didParseCell: (data) => {
        if (data.row.index !== 6 && data.column.index === 1) {
          data.cell.colSpan = 3;
        }
        if (data.row.index === 2 && data.column.index === 0) {
          data.cell.rowSpan = 3;
        }
        if (data.row.index === 6 && data.column.index === 2) {
          data.cell.styles.fillColor = darkBlueRgb;
          data.cell.styles.textColor = whiteRgb;
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.cellWidth = 60;
        }
      },
      didDrawPage: (data) => tableDidDrawTable(data),
    });
    finalY = doc.previousAutoTable.finalY;
    // #endregion

    // #region 2. Categoria dos Itens
    addTitle('2. Categoria dos Itens');

    const bodyCategoriasItens: any[] = [[cotacaoMapaComparativoPorItem.categorias]];

    doc.autoTable({
      startY: finalY + 4,
      body: bodyCategoriasItens,
      margin: { left: marginX, right: marginX },
      styles: tableStyle,
      columnStyles: { 0: { fillColor: blueRgb } },
      didDrawPage: (data) => tableDidDrawTable(data),
    });
    finalY = doc.previousAutoTable.finalY;
    // #endregion

    // #region 3. Itens da Cotação
    addTitle('3. Itens da Cotação');

    const bodyItens: any[] = [];
    const headItens = [
      {
        codigo: 'Código',
        descricao: 'Descrição',
        solicitante: 'Solicitante',
        condicaoPagamento: 'Cond. Pag.',
        quantidade: 'Quant.',
        marca: 'Marca',
        valorReferencia: 'Valor Ref.',
        valorTotal: 'Valor Total',
      },
    ];
    cotacaoMapaComparativoPorItem.itens.forEach((item) => {
      bodyItens.push([
        item.idRequisicaoItem,
        item.produto.descricao,
        item.cnpj,
        item.condicaoPagamento.descricao,
        item.quantidade,
        item.marca ? item.marca.nome : 'Sem Preferência',
        this.customCurrencyPipe.transform(item.valorReferencia, item.moeda, null, null),
        this.customCurrencyPipe.transform(
          item.quantidade * item.valorReferencia,
          item.moeda,
          null,
          null,
        ),
      ]);
    });

    doc.autoTable({
      startY: finalY + 4,
      head: headItens,
      body: bodyItens,
      styles: tableStyle,
      headStyles: tableHeadStyle,
      alternateRowStyles: tableAlternateRowStyle,
      margin: { left: marginX, right: marginX },
      didDrawPage: (data) => tableDidDrawTable(data),
    });
    finalY = doc.previousAutoTable.finalY;
    // #endregion

    // #region 4. Termos de Concordância
    addTitle('4. Termos de Concordância');

    const bodyTermos: any[] = [
      [
        cotacaoMapaComparativoPorItem.possuiTermoConcordancia
          ? cotacaoMapaComparativoPorItem.termoConcordancia
          : 'Não possui termos de concordância',
      ],
    ];

    doc.autoTable({
      startY: finalY + 4,
      body: bodyTermos,
      margin: { left: marginX, right: marginX },
      styles: tableStyle,
      columnStyles: { 0: { fillColor: blueRgb } },
      didDrawPage: (data) => tableDidDrawTable(data),
    });
    finalY = doc.previousAutoTable.finalY;
    // #endregion

    // #region 5. Anexos da Cotação
    addTitle('5. Anexos da Cotação');

    const bodyAnexos: any[] = [];
    const headAnexos = [{ nomeAnexo: 'Nome do Anexo' }];
    if (cotacaoMapaComparativoPorItem.anexos && cotacaoMapaComparativoPorItem.anexos.length) {
      cotacaoMapaComparativoPorItem.anexos.forEach((anexo) => {
        bodyAnexos.push([anexo.nome]);
      });
    } else {
      bodyAnexos.push(['Não possui anexos']);
    }

    doc.autoTable({
      startY: finalY + 4,
      head: headAnexos,
      body: bodyAnexos,
      styles: tableStyle,
      headStyles: tableHeadStyle,
      alternateRowStyles: tableAlternateRowStyle,
      margin: { left: marginX, right: marginX },
      didDrawPage: (data) => tableDidDrawTable(data),
    });
    finalY = doc.previousAutoTable.finalY;
    // #endregion

    // #region 6. Fornecedores Convidados
    addTitle('6. Fornecedores Convidados');

    let bodyFornecedoresConvidados: any[] = [];

    bodyFornecedoresConvidados = [
      [
        'Convite:',
        'Padrão - Todos os Fornecedores com ramos de atividade que atendam as classificações dos itens cotados',
      ],
      [
        'N° de Fornecedores Convidados:',
        cotacaoMapaComparativoPorItem.participantes
          ? cotacaoMapaComparativoPorItem.participantes.length
          : '0',
      ],
      [
        'Fornecedores que Acessaram:',
        cotacaoMapaComparativoPorItem.visualizacoes
          ? cotacaoMapaComparativoPorItem.visualizacoes.length
          : '0',
      ],
      [
        'Fornecedores que não Aceitaram Termos:',
        cotacaoMapaComparativoPorItem.possuiTermoConcordancia
          ? cotacaoMapaComparativoPorItem.participantesRecusaram
            ? cotacaoMapaComparativoPorItem.participantesRecusaram.length
            : 0
          : '--',
      ],
      [
        'Fornecedores que Responderam:',
        cotacaoMapaComparativoPorItem.participantesResponderam
          ? cotacaoMapaComparativoPorItem.participantesResponderam.length
          : '0',
      ],
    ];

    doc.autoTable({
      startY: finalY + 4,
      body: bodyFornecedoresConvidados,
      bodyStyles: { fillColor: whiteRgb },
      margin: { left: marginX, right: marginX },
      styles: tableStyle,
      columnStyles: {
        0: {
          cellWidth: 130,
          fillColor: darkBlueRgb,
          fontStyle: 'bold',
          textColor: whiteRgb,
        },
      },
      alternateRowStyles: tableAlternateRowStyle,
      didDrawPage: (data) => tableDidDrawTable(data),
    });
    finalY = doc.previousAutoTable.finalY;

    addPageIfNecessary();
    // #region Fornecedores que Acessaram a Cotação
    const bodyFornecedoresAcessaram: any[] = [];
    const headFornecedoresAcessaram = [
      ['Fornecedores que Acessaram a Cotação', null, null, null],
      ['Fornecedor', 'CNPJ', 'Usuário', 'Data Hora do Acesso'],
    ];

    if (
      cotacaoMapaComparativoPorItem.visualizacoes &&
      cotacaoMapaComparativoPorItem.visualizacoes.length
    ) {
      cotacaoMapaComparativoPorItem.visualizacoes.forEach((visualizacao) => {
        bodyFornecedoresAcessaram.push([
          visualizacao.pessoaJuridica.razaoSocial,
          visualizacao.pessoaJuridica.cnpj,
          `${visualizacao.usuario.pessoaFisica.nome} - ${visualizacao.usuario.email}`,
          moment(visualizacao.dataVisualizacao).format('DD/MM/YYYY HH:mm'),
        ]);
      });
    } else {
      bodyFornecedoresAcessaram.push(['Nenhum fornecedor acessou a cotação']);
    }

    doc.autoTable({
      startY: finalY + 15,
      head: headFornecedoresAcessaram,
      body: bodyFornecedoresAcessaram,
      styles: tableStyle,
      headStyles: tableHeadStyle,
      alternateRowStyles: tableAlternateRowStyle,
      margin: { left: marginX, right: marginX },
      didParseCell: (data) => {
        if (data.section === 'head' && data.row.index === 0 && data.column.index === 0) {
          data.cell.colSpan = 4;
        }

        if (
          !cotacaoMapaComparativoPorItem.visualizacoes ||
          !cotacaoMapaComparativoPorItem.visualizacoes.length
        ) {
          if (data.section === 'body' && data.row.index === 0 && data.column.index === 0) {
            data.cell.colSpan = 4;
          }
        }
      },
      didDrawPage: (data) => tableDidDrawTable(data),
    });
    finalY = doc.previousAutoTable.finalY;
    // #endregion

    addPageIfNecessary();
    // #region Fornecedores Fornecedores que não Aceitaram Termos da Cotação
    const bodyFornecedoresRecusaram: any[] = [];
    const headFornecedoresRecusaram = [
      ['Fornecedores que não Aceitaram Termos da Cotação', null],
      ['Fornecedor', 'CNPJ'],
    ];

    if (
      cotacaoMapaComparativoPorItem.participantesRecusaram &&
      cotacaoMapaComparativoPorItem.participantesRecusaram.length
    ) {
      cotacaoMapaComparativoPorItem.participantesRecusaram.forEach((participante) => {
        bodyFornecedoresRecusaram.push([
          participante.pessoaJuridica.razaoSocial,
          participante.pessoaJuridica.cnpj,
        ]);
      });
    } else {
      bodyFornecedoresRecusaram.push([
        'Nenhum fornecedor deixou de aceitar os termos de concordância',
      ]);
    }

    doc.autoTable({
      startY: finalY + 15,
      head: headFornecedoresRecusaram,
      body: bodyFornecedoresRecusaram,
      styles: tableStyle,
      headStyles: tableHeadStyle,
      alternateRowStyles: tableAlternateRowStyle,
      margin: { left: marginX, right: marginX },
      didParseCell: (data) => {
        if (data.section === 'head' && data.row.index === 0 && data.column.index === 0) {
          data.cell.colSpan = 2;
        }

        if (
          !cotacaoMapaComparativoPorItem.participantesRecusaram ||
          !cotacaoMapaComparativoPorItem.participantesRecusaram.length
        ) {
          if (data.section === 'body' && data.row.index === 0 && data.column.index === 0) {
            data.cell.colSpan = 2;
          }
        }
      },
      didDrawPage: (data) => tableDidDrawTable(data),
    });
    finalY = doc.previousAutoTable.finalY;
    // #endregion

    addPageIfNecessary();
    // #region Fornecedores que Responderam a Cotação
    const bodyFornecedoresResponderam: any[] = [];
    const headFornecedoresResponderam = [
      ['Fornecedores que Responderam a Cotação', null, null, null, null, null, null],
      ['Fornecedor', 'CNPJ', 'Quantos Itens Cotados', 'Data Hora', 'Usuário', 'E-mail', 'Telefone'],
    ];

    if (
      cotacaoMapaComparativoPorItem.participantesResponderam &&
      cotacaoMapaComparativoPorItem.participantesResponderam.length
    ) {
      cotacaoMapaComparativoPorItem.participantesResponderam.forEach((participante) => {
        bodyFornecedoresResponderam.push([
          participante.pessoaJuridica.razaoSocial,
          participante.pessoaJuridica.cnpj,
          `${participante.quantidadeItensCotados} de ${cotacaoMapaComparativoPorItem.itens.length}`,
          participante.dataHoraEnvioProposta
            ? moment(participante.dataHoraEnvioProposta).format('DD/MM/YYYY HH:mm')
            : '--',
          participante.usuarioEnvioProposta
            ? participante.usuarioEnvioProposta.pessoaFisica.nome
            : '--',
          participante.usuarioEnvioProposta ? participante.usuarioEnvioProposta.email : '--',
          participante.usuarioEnvioProposta && participante.usuarioEnvioProposta.telefone
            ? participante.usuarioEnvioProposta.telefone
            : '--',
        ]);
      });
    } else {
      bodyFornecedoresResponderam.push(['Nenhum fornecedor respondeu a cotação']);
    }

    doc.autoTable({
      startY: finalY + 15,
      head: headFornecedoresResponderam,
      body: bodyFornecedoresResponderam,
      styles: tableStyle,
      headStyles: tableHeadStyle,
      alternateRowStyles: tableAlternateRowStyle,
      margin: { left: marginX, right: marginX },
      didParseCell: (data) => {
        if (data.section === 'head' && data.row.index === 0 && data.column.index === 0) {
          data.cell.colSpan = 7;
        }

        if (
          !cotacaoMapaComparativoPorItem.participantesResponderam ||
          !cotacaoMapaComparativoPorItem.participantesResponderam.length
        ) {
          if (data.section === 'body' && data.row.index === 0 && data.column.index === 0) {
            data.cell.colSpan = 7;
          }
        }
      },
      didDrawPage: (data) => tableDidDrawTable(data),
    });
    finalY = doc.previousAutoTable.finalY;
    // #endregion

    // #endregion

    // #region 7. Mapa Comparativo por Item da Cotação
    addTitle('7. Fornecedores que Responderam a Cotação');

    let ordenacao = 0;
    // Itens
    cotacaoMapaComparativoPorItem.itens.forEach((item, index) => {
      addPageIfNecessary();

      ordenacao = ordenacao + 1;

      const headMapaComparativoItem = [
        [
          `${'ITEM ' + ordenacao} - ${item.idRequisicaoItem} - ${item.produto.descricao}\n${item.cnpj} - ${item.razaoSocial}`,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        ['Código NCM', 'Cond. Pag.', 'Incoterms', 'Quant.', 'Marca', 'Valor Ref.', 'Valor Total'],
      ];
      const bodyMapaComparativoItem = [
        [
          item.produto.codigoNcm,
          item.condicaoPagamento.descricao,
          item.incoterms,
          item.quantidade,
          item.marca ? item.marca.nome : 'Sem Preferência',
          this.customCurrencyPipe.transform(item.valorReferencia, item.moeda, null, null),
          this.customCurrencyPipe.transform(
            item.valorReferencia * item.quantidade,
            item.moeda,
            null,
            null,
          ),
        ],
      ];
      doc.autoTable({
        startY: finalY + (index === 0 ? 4 : 15),
        head: headMapaComparativoItem,
        body: bodyMapaComparativoItem,
        styles: tableStyle,
        headStyles: tableHeadStyle,
        alternateRowStyles: tableAlternateRowStyle,
        margin: { left: marginX, right: marginX },
        didParseCell: (data) => {
          if (data.section === 'head' && data.row.index === 0 && data.column.index === 0) {
            data.cell.colSpan = 7;
          }
        },
        didDrawPage: (data) => {
          if (data.pageCount === 1) {
            data.settings.margin.top = marginY + 24;
          } else {
            startPage();
          }
        },
      });
      finalY = doc.previousAutoTable.finalY;

      // Rodadas
      item.rodadas.forEach((rodada) => {
        addPageIfNecessary(80);

        const headRodada = [[`Rodada ${rodada.ordem}`, null, null, null]];
        const bodyRodada = [
          [
            'Data Inicio:',
            moment(rodada.dataInicio).format('DD/MM/YYYY'),
            'Data Fim:',
            moment(rodada.dataEncerramento).format('DD/MM/YYYY'),
          ],
        ];

        doc.autoTable({
          startY: finalY + 15,
          head: headRodada,
          body: bodyRodada,
          styles: tableStyle,
          headStyles: tableHeadStyle,
          alternateRowStyles: tableAlternateRowStyle,
          margin: { left: marginX, right: marginX },
          didParseCell: (data) => {
            if (data.section === 'head' && data.row.index === 0 && data.column.index === 0) {
              data.cell.colSpan = 4;
            }
            if (data.section === 'body' && (data.column.index === 0 || data.column.index === 2)) {
              data.cell.styles.textColor = whiteRgb;
              data.cell.styles.fillColor = darkBlueRgb;
              data.cell.styles.fontStyle = 'bold';
            }
          },
          didDrawPage: (data) => {
            if (data.pageCount === 1) {
              data.settings.margin.top = marginY + 24;
            } else {
              startPage();
            }
          },
        });
        finalY = doc.previousAutoTable.finalY;

        //#region Propostas

        const tablePropostaHeadStyle = {
          fillColor: whiteRgb,
          fontSize: fontSize,
          textColor: textBlueRgb,
        };

        const tablePropostaStyle = {
          fontSize: fontSize,
          textColor: grayRgb,
        };

        addPageIfNecessary();
        const imgVencedorData =
          'iVBORw0KGgoAAAANSUhEUgAAABQAAAAZCAYAAAAxFw7TAAACRklEQVRIS+WVT0hUURjFf/deGTFRkUidpIQSLWq0ZKLyD25atXZT1KJNBZZYi/7ZokUYERUG0qJFQS1atQna1MKwsj8zZJmFBGboWE4lNWmK8+678d6rsWmmHMGdd/Xe5Tvnfufc870nZm5uNCzgEoucUBRvQuQUJRw1sSHMeH+Kw2J5A8KXn7YuycOsxk5EyRZAuMVmMoLuOYH50pcAy4odqMAByMrx9mwLe+AG+uUl9zWJUPjrUMGTiCXFvwgM9vA99KOjXnFeGaruHKKgfLa7sWdYDw6DNZlK6Oyo9fuQa/aA8nmg+Hd0bwf24C1UzTFkeRMI6Sn4MYYOncZ8eJg4IG1sVO1Z5Iptrhzz9S32+zuY0fvIyt0IfwMitwR0HHvgOrqvM8njtIQifxWyugUTDSP9tYjCtSAVWNPYH3swExFE3kr047bUC/tXsOXqJlRVM/gKUkAm9g4dPoOJhjIjFEsDqK3tiNxSD2BNYT73Ioo3z/o39hSra39mhGrDIWTFTg9sTWM+hdH9V1DBNlcqKhtmYuhQO/bw3bk9VPUXkaWNMD2OftGBPXQ7AVLVrThZdCP45hr61eV5EDrRmBhB9xx3J8bpWgWavVDb8XkQVrUgK3eBzMLEBtHPzyOX1bjPquaId1Ez3zKX7MRG1V/w/DLakySUm0s3Po7c0W50d2tml+JUybLtyKqDf4zhb6xx5esnp9yO/17//cA6My3X7UUUBRHZhZipKCbShX59NTG78yJMOT6DjcX+C8jAojlLFtzDnzBoF6vqQXIYAAAAAElFTkSuQmCC';

        const imgDesclassificadoData =
          'iVBORw0KGgoAAAANSUhEUgAAABwAAAAgCAYAAAABtRhCAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAGdSURBVEhL7ZaxSwJxFMe/epoXajgogRJEEBQFORRC0BBEhARRS0tQU0O0NDUJrUEQBA1uhX+BEC4VDUHgJG5N0qIhRkbeWWde1x2+QLhfpyeHQ9xnue97v+H7fr/fez/O8bwyraCPOOnbN2xDy7ENLcf8HI5vwLcWBz8XhWvIQ0mVRg1yLonXo0vIlGLBNOQTdwjMBykCvh8O8fa0Cv/CJFzhIBwcLeh4gXSyiOothQyYR8p52yrX8IbgnorCPWJkpuGHczRCmo3Fd+iBe3aXNBvrm2aAh9EhWG8YnoCPJIu+j8XfhnIRnxcZyEY9ziQEbp0kg653qHRt7Icrtk1aD9NQFiV1NiLgd+LgtA4QK6ifJ9F4b60bI0Eu3JDWY+6liR0jlKAifhGLaFbUAkl/5a8gpNSraGV0mH7aPAdpBJbH4KAYH3kI+1sQShR3wHSXSqd7EPI1ilQGZ8BvGr8u7fQwFkWIZ9doUqThHF4i1ZkeDFVKGTTLpFWU6iOpzvRmiCzquQK0y1fK96insq10F9j/pZZjG1rOfzcEfgCODGmHgF/6MgAAAABJRU5ErkJggg==';

        const imgDesconsideradoData =
          'iVBORw0KGgoAAAANSUhEUgAAABcAAAAbCAYAAACX6BTbAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB3SURBVEhL7ZFBCsAwCATzoD6kn/cdfYYlh4DI2Boh9NAszCFxmYO26zx0FVuO/EQ+QjMiLfehjudV/hTqW9Jy/2ffESV5ltJaqEeUD9pDPUtabhmhmeV7eRTqWspy6nmm1jJCM2JaTv8RpYNm2XJky5EmIroG0RvesBfd8hz6WgAAAABJRU5ErkJggg==';

        const headPropostas = [
          [`Condições e Preços por Fornecedor`, null, null, null, null],
          ['Fornecedor - CNPJ', 'Marca', 'Quant.', 'Preço Un.', 'Preço Bruto'],
        ];

        rodada.propostas.forEach((proposta) => {
          const bodyPropostas: Array<any> = new Array<any>();

          bodyPropostas.push([
            `${proposta.fornecedor.razaoSocial} - ${proposta.fornecedor.cnpj}`,
            proposta.marca,
            proposta.quantidadeDisponivel,
            this.customCurrencyPipe.transform(proposta.precoUnidade, item.moeda, '1.2-4', null),
            this.customCurrencyPipe.transform(proposta.precoBruto, item.moeda, '1.2-4', null),
            proposta.desclassificado,
            proposta.vencedor,
          ]);

          let text = '';
          if (
            proposta.desclassificado &&
            proposta.cotacaoRodadaPropostaMotivoDesclassificacao.motivoDesclassificacao
          ) {
            text =
              'Desclassificado por: ' +
              proposta.cotacaoRodadaPropostaMotivoDesclassificacao.motivoDesclassificacao
                .descricao +
              '\n' +
              'Observação: ' +
              proposta.cotacaoRodadaPropostaMotivoDesclassificacao.justificativa;
          } else {
            text = 'Observação: Preço Desconsiderado.';
          }
          if (proposta.desclassificado) {
            bodyPropostas.push([
              {
                content: text,
                colSpan: 5,
                rowSpan: 1,
              },
            ]);
          }
          let styleDesclassificado;
          let lastStyleCell;
          doc.autoTable({
            startY: finalY + (index === 0 ? 0.5 : 10),
            head: headPropostas,
            body: bodyPropostas,
            didDrawCell: (data) => {
              // let indexVencedor = rodada.propostas.findIndex(p => p.vencedor);

              if (data.section === 'body' && data.column.index === 0) {
                // Add Imagem Vencedor
                if (
                  data.row.raw.length > 6 &&
                  data.row.raw[6] // vencedor
                ) {
                  const base64Img = imgVencedorData;
                  doc.addImage(base64Img, 'PNG', data.cell.width, data.cell.y, 15, 14.5);
                }

                // Add Imagem Desclassificado
                if (
                  data.row.raw.length > 6 &&
                  data.row.raw[5] // desclassificado
                ) {
                  const base64Img = imgDesclassificadoData;
                  doc.addImage(base64Img, 'PNG', data.cell.width, data.cell.y, 12, 14);
                }
              }
              if (
                data.section === 'body' &&
                data.column.index === 4 &&
                proposta.desconsideradoPreco
              ) {
                doc.addImage(imgDesconsideradoData, 'PNG', data.table.width, data.cell.y, 12, 14); // magic
              }
            },
            styles: tablePropostaStyle,
            headStyles: tablePropostaHeadStyle,
            alternateRowStyles: tableAlternateRowStyle,
            margin: { left: marginX, right: marginX },
            didParseCell: (data) => {
              if (data.column.index === 0) {
                data.cell.styles.cellWidth = defaultTableWidth / 2;
              } else if (
                data.column.index > 0 &&
                data.column.index < data.table.columns.length - 1
              ) {
                data.cell.styles.cellWidth = defaultTableWidth / 10;
              } else if (data.column.index === data.table.columns.length - 1) {
                data.cell.styles.cellWidth = defaultTableWidth / 5;
              }

              if (data.section === 'head' && data.row.index === 0 && data.column.index === 0) {
                data.cell.colSpan = 5;
                data.cell.styles.fillColor = darkBlueRgb;
                data.cell.styles.textColor = whiteRgb;
              }

              if (data.section === 'body' && data.column.index === 4) {
                data.cell.styles.textColor = redRgb;
              }

              if (data.section === 'body' && data.column.index === 0) {
                if (
                  data.row.raw.length > 6 &&
                  data.row.raw[5] // desclassificado
                ) {
                  if (styleDesclassificado) {
                    if (data.cell.styles.fillColor === whiteRgb) {
                      lastStyleCell = data.cell.styles.fillColor = blueRgb;
                    } else {
                      lastStyleCell = data.cell.styles.fillColor = whiteRgb;
                    }
                  }
                  styleDesclassificado = data.cell.styles.fillColor;
                } else if (data.row.raw.length > 6 && styleDesclassificado) {
                  if (data.cell.styles.fillColor === whiteRgb) {
                    lastStyleCell = data.cell.styles.fillColor = blueRgb;
                  } else {
                    lastStyleCell = data.cell.styles.fillColor = whiteRgb;
                  }
                }

                // Motivo desclassificacao
                if (
                  data.row.raw.length === 1 &&
                  data.row.raw[0].content.includes('Desclassificado')
                ) {
                  data.cell.styles.fillColor = styleDesclassificado;
                }
              }

              if (
                styleDesclassificado &&
                lastStyleCell &&
                lastStyleCell !== data.cell.styles.fillColor &&
                data.section === 'body' &&
                data.row.raw.length > 6 &&
                data.column.index > 0
              ) {
                if (data.cell.styles.fillColor === whiteRgb) {
                  data.cell.styles.fillColor = blueRgb;
                } else {
                  data.cell.styles.fillColor = whiteRgb;
                }
              }
            },
            willDrawCell: this.willDrawCell,
            didDrawPage: (data) => tableDidDrawTable(data),
          });
          finalY = doc.previousAutoTable.finalY;

          //#region Proposta Pagamento

          addPageIfNecessary(80);

          const headerPropostasPagamento = [
            [
              'Embalagem Embarque: ',
              'Tipo Frete',
              'Valor do Frete: ',
              'Condição de Pgto.:',
              'Faturamento Mínimo: ',
            ],
          ];

          const bodyPropostasPagamento: Array<any> = new Array<any>();

          bodyPropostasPagamento.push([
            `${proposta.embalagemEmbarque} ${proposta.unidadeMedidaEmbalagemEmbarque.sigla}`,
            TipoFrete[proposta.incoterms],
            this.customCurrencyPipe.transform(proposta.valorFrete, item.moeda, '1.2-4', null),
            proposta.condicaoPagamento.descricao,
            proposta.faturamentoMinimo,
          ]);

          doc.autoTable({
            startY: finalY + 0.5,
            head: headerPropostasPagamento,
            body: bodyPropostasPagamento,
            styles: tablePropostaStyle,
            headStyles: tablePropostaHeadStyle,
            alternateRowStyles: tableAlternateRowStyle,
            margin: { left: marginX, right: marginX },
            didParseCell: (data) => {
              if (
                data.column.index === 0 ||
                data.column.index === 2 ||
                data.column.index === data.table.columns.length - 1
              ) {
                data.cell.styles.cellWidth = defaultTableWidth / 5;
              }

              if (data.column.index === 1) {
                data.cell.styles.cellWidth = defaultTableWidth / 10;
              }
            },
            willDrawCell: this.willDrawCell,
            didDrawPage: (data) => tableDidDrawTable(data),
          });

          finalY = doc.previousAutoTable.finalY;

          //#endregion

          //#region Proposta Imposto

          const headerPropostasImposto = [[
            'Data da Entrega Solic.:',
            'Prazo da Entrega',
            'PIS Alíq.(%):',
            'COFINS Alíq.(%):',
          ]];

          if (item.produto.tipo === 1) {
            headerPropostasImposto[0] = headerPropostasImposto[0].concat([
              'IPI Alíq.(%):',
              'ICMS Alíq.(%):',
              'DIFAL Alíq.(%):',
              'ST Alíq.(%):',
            ]);
          } else {
            headerPropostasImposto[0] = headerPropostasImposto[0].concat([
              'CSLL Alíq.(%):',
              'ISS Alíq.(%):',
              'IR Alíq.(%):',
              'INSS Alíq.(%):',
            ]);
          }

          addPageIfNecessary(80);
          const bodyPropostasImposto: Array<any> = new Array<any>();

          bodyPropostasImposto.push([
            this.prepararExibicaoData(proposta.dataEntregaDisponivel),
            this.prepararExibicao(proposta.prazoEntrega + ' dia(s) útil(eis)'),
            this.prepararExibicao(proposta.pisAliquota),
            this.prepararExibicao(proposta.confinsAliquota),
          ]);

          if (item.produto.tipo === 1) {
            bodyPropostasImposto[0] = bodyPropostasImposto[0].concat([
              this.prepararExibicao(proposta.ipiAliquota),
              this.prepararExibicao(proposta.icmsAliquota),
              this.prepararExibicao(proposta.difalAliquota),
              this.prepararExibicao(proposta.stAliquota),
            ]);
          } else {
            bodyPropostasImposto[0] = bodyPropostasImposto[0].concat([
              this.prepararExibicao(proposta.csllAliquota),
              this.prepararExibicao(proposta.issAliquota),
              this.prepararExibicao(proposta.irAliquota),
              this.prepararExibicao(proposta.inssAliquota),
            ]);
          }

          doc.autoTable({
            startY: finalY + 0.5,
            head: headerPropostasImposto,
            body: bodyPropostasImposto,
            styles: tablePropostaStyle,
            headStyles: tablePropostaHeadStyle,
            alternateRowStyles: tableAlternateRowStyle,
            margin: { left: marginX, right: marginX },
            didParseCell: (data) => {
              if (data.section === 'head' && data.column.index > 1) {
                data.cell.styles.fontSize = 6;
              }

              if (data.column.index > 1) {
                data.cell.styles.fillColor = [233, 250, 255];
                data.cell.styles.cellWidth = defaultTableWidth / 10;
                data.cell.styles.fontStyle = 'bold';
              } else {
                data.cell.styles.cellWidth = defaultTableWidth / 5;
              }
            },
            didDrawPage: (data) => tableDidDrawTable(data),
            willDrawCell: this.willDrawCell,
          });

          finalY = doc.previousAutoTable.finalY;

          //#endregion

          //#region Proposta Modelo

          const headerPropostasModelo = [['NCM:', 'CA:', 'Modelo:', 'Garantia:', 'Vl. Líquido:']];

          addPageIfNecessary(80);

          const bodyPropostasModelo: Array<any> = new Array<any>();
          bodyPropostasModelo.push([
            this.prepararExibicao(proposta.ncm),
            this.prepararExibicao(proposta.ca),
            this.prepararExibicao(proposta.modelo),
            this.prepararExibicao(proposta.garantia),
            this.prepararExibicaoMoeda(proposta.precoLiquido, item.moeda),
          ]);

          doc.autoTable({
            startY: finalY + 0.5,
            head: headerPropostasModelo,
            body: bodyPropostasModelo,
            styles: tablePropostaStyle,
            headStyles: tablePropostaHeadStyle,
            alternateRowStyles: tableAlternateRowStyle,
            margin: { left: marginX, right: marginX },
            didParseCell: (data) => {
              if (data.section === 'body' && data.column.index === 4) {
                data.cell.styles.textColor = greenRgb;
              }

              data.cell.styles.cellWidth = defaultTableWidth / 5;
            },
            didDrawPage: (data) => tableDidDrawTable(data),
            willDrawCell: this.willDrawCell,
          });

          finalY = doc.previousAutoTable.finalY;

          //#endregion

          //#region Proposta Observacao

          const headerPropostasObservacao = [['OBS:']];

          addPageIfNecessary(80);

          const bodyPropostasObservacao: Array<any> = new Array<any>();
          bodyPropostasObservacao.push([this.prepararExibicao(proposta.observacao)]);

          doc.autoTable({
            startY: finalY + 0.5,
            head: headerPropostasObservacao,
            body: bodyPropostasObservacao,
            styles: tablePropostaStyle,
            headStyles: tableHeadStyle,
            alternateRowStyles: tableAlternateRowStyle,
            margin: { left: marginX, right: marginX },
            willDrawCell: this.willDrawCell,
            didDrawPage: (data) => tableDidDrawTable(data),
          });

          finalY = doc.previousAutoTable.finalY;

          //#endregion
        });

        //#endregion
      });
    });
    // #endregion

    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }

    doc.save(`mapa_comparativo_cotacao_${cotacaoMapaComparativoPorItem.idCotacao}` + '.pdf');
  }

  // #endregion

  //#region Utils

  private willDrawCell(data) {
    data.doc.setDrawColor(0, 187, 243);
    data.doc.setLineWidth(1);
    data.doc.line(data.cell.x, data.cell.y + data.row.height, data.cell.x, data.cell.y, null);
    if (data.column.index === data.table.columns.length - 1) {
      data.doc.line(
        data.cell.x + data.cell.width,
        data.cell.y + data.row.height,
        data.cell.x + data.cell.width,
        data.cell.y,
        null,
      );
    }

    if (data.section === 'head') {
      data.doc.line(data.cell.x, data.cell.y, data.cell.x + data.cell.width, data.cell.y);
    }

    if (data.section === 'body') {
      data.doc.line(
        data.cell.x,
        data.cell.y + data.row.height,
        data.cell.x + data.cell.width,
        data.cell.y + data.row.height,
      );
    }
  }

  private prepararExibicaoData(date, saidaPadrao: string = '-') {
    return this.prepararExibicao(date ? moment(date).format('dd/MM/yyyy') : null, saidaPadrao);
  }

  private prepararExibicaoMoeda(
    valor: number,
    moeda: Moeda,
    digitos: string = '1.2-4',
    saidaPadrao: string = '-',
  ) {
    return this.prepararExibicao(
      this.customCurrencyPipe.transform(valor, moeda, digitos, null),
      saidaPadrao,
    );
  }

  private prepararExibicao(dado, saidaSemDado: string = '-') {
    if (dado || dado === 0) {
      return dado;
    }

    return saidaSemDado;
  }

  //#endregion
}
