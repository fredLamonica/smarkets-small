import { PorteEmpresa } from ".";
import { StatusSolicitacaoFornecedor } from "./enums/status-solicitacao-fornecedor"

export class SolicitacaoFornecedor{

     idSolicitacaoFornecedor : number;
     status : StatusSolicitacaoFornecedor;
     codigoERP : string;
     razaoSocial : string;
     nomeFantasia : string;
     cnpj : string;
     dataAberturaCnpj : Date;
     porte : PorteEmpresa
     idNaturezaJuridica : number; 
        // public int NumeroFuncionarios { get; set; }
        // public TipoCadastroEmpresa? TipoCadastro { get; set; }
        // public string HomePage { get; set; }
        // public string Contato { get; set; }
        // public string Telefone { get; set; }
        // public string Email { get; set; }
        // public PerfilTributario? PerfilTributario { get; set; }
        // public string InscricaoEstadual { get; set; }
        // public string InscricaoMunicipal { get; set; }
        // public decimal PatrimonioLiquido { get; set; }
        // public bool OptanteSimplesNacional { get; set; }
        // public decimal CapitalSocial { get; set; }
        // public decimal CapitalIntegralizado { get; set; }
        // public DateTime? DataIntegralizacao { get; set; }
        // public long? IdUsuarioResponsavel { get; set; }
        // public long? IdSlaSolicitacao { get; set; }
        // public string MotivoCancelamento { get; set; }

        // [IdTenant]
        // public long IdTenant { get; set; }
        // [Ignorar]
        // public string Empresa { get; set; }

        // [Ignorar]
        // public DateTime? DataExclusao { get; set; }
        // public SolicitadoPor SolicitadoPor { get; set; }
}