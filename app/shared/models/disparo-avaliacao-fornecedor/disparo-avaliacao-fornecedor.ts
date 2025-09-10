import { Usuario } from '../usuario';
import { FornecedorInteressado } from '../fornecedor-interessado';
import { PessoaFisica } from '../pessoa-fisica';

export class DisparoAvaliacaoFornecedor {
  public idDisparoAvaliacaoFornecedor: number;
  public idAvaliacaoFornecedor: number;
  public idUsuarioDisparou: number;
  public nomeAvaliacao: string;
  public dataInicio: Date;
  public dataFim: Date;
  public introducao: string;
  public usuarios: Array<Usuario>;
  public fornecedores: Array<FornecedorInteressado>;
  public dataDisparo: Date;
  public usuarioDisparou: Usuario = new Usuario();

  constructor(autor?: string, dataDisparo?: Date) {
    if (autor && dataDisparo) {
      this.usuarioDisparou.pessoaFisica = new PessoaFisica();
      this.usuarioDisparou.pessoaFisica.nome = autor;
      this.dataDisparo = dataDisparo;
    }
  }
}
