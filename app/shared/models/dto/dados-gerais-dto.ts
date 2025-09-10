import { PerfilTributario, PorteEmpresa } from "..";
import { TipoCadastroEmpresa } from "../enums/tipo-cadastro-empresa";

export class DadosGeraisDto {
    public codigoFornecedor: string;
    public idPessoaJuridica: number;
    public tipoCadastro: TipoCadastroEmpresa;
    public porte: PorteEmpresa;
    public numeroFuncionarios: number;
    public dataValidade: string;
    public razaoSocial: string;
    public nomeFantasia: string;
    public contato: string;
    public telefone: string;
    public email: string;
    public idNaturezaJuridica: number;
    public homePage: string;
    public inscricaoEstadual: string;
    public inscricaoMunicipal: string;
    public patrimonioLiquido: number;
    public perfilTributario: PerfilTributario;
    public capitalSocial: number;
    public capitalIntegralizado: number;
    public dataIntegralizacao: string;
    public optanteSimplesNacional: boolean;
    public idUsuarioPrincipal: number;

    constructor(
        codigoFornecedor: string,
        idPessoaJuridica: number,
        tipoCadastro: TipoCadastroEmpresa,
        porte: PorteEmpresa,
        numeroFuncionarios: number,
        dataValidade: string,
        razaoSocial: string,
        nomeFantasia: string,
        contato: string,
        telefone: string,
        email: string,
        idNaturezaJuridica: number,
        homePage: string,
        inscricaoEstadual: string,
        inscricaoMunicipal: string,
        patrimonioLiquido: number,
        perfilTributario: PerfilTributario,
        capitalSocial: number,
        capitalIntegralizado: number,
        dataIntegralizacao: string,
        optanteSimplesNacional: boolean,
        idUsuarioPrincipal: number

    ) {
        this.codigoFornecedor = codigoFornecedor,
        this.idPessoaJuridica = idPessoaJuridica,
        this.tipoCadastro = tipoCadastro,
        this.porte = porte,
        this.numeroFuncionarios = numeroFuncionarios,
        this.dataValidade = dataValidade,
        this.razaoSocial = razaoSocial,
        this.nomeFantasia = nomeFantasia,
        this.porte = porte,
        this.contato = contato,
        this.telefone = telefone,
        this.email = email,
        this.idNaturezaJuridica = idNaturezaJuridica;
        this.homePage = homePage,
        this.inscricaoEstadual = inscricaoEstadual,
        this.inscricaoMunicipal = inscricaoMunicipal,
        this.patrimonioLiquido = patrimonioLiquido,
        this.perfilTributario = perfilTributario,
        this.capitalSocial = capitalSocial,
        this.capitalIntegralizado = capitalIntegralizado,
        this.dataIntegralizacao = dataIntegralizacao,
        this.optanteSimplesNacional = optanteSimplesNacional,
        this.idUsuarioPrincipal = idUsuarioPrincipal
    }
}