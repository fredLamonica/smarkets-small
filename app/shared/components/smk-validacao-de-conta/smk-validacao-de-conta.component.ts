import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { createNumberMask } from 'text-mask-addons';
import { Usuario } from '../../models';
import { CodigoVerificacaoDto } from '../../models/dto/validacao-de-conta/codigo-verificacao-dto';
import { ValidacaoDeContaDto } from '../../models/dto/validacao-de-conta/validacao-de-conta-dto';
import { AutenticacaoService } from '../../providers/autenticacao.service';
import { ValidacaoDeContaService } from '../../providers/validacao-de-conta.service';
import { ErrorService } from '../../utils/error.service';
import { Unsubscriber } from '../base/unsubscriber';
import { SmkConfirmacaoComponent } from '../modals/smk-confirmacao/smk-confirmacao.component';
import { MetodoValidacaoDeConta } from './models/metodo-validacao-de-conta.enum';
import { ResultadoValidacaoDeConta } from './models/resultado-validacao-de-conta.enum';
import { TipoValidacaoDeConta } from './models/tipo-validacao-de-conta.enum';

@Component({
  selector: 'smk-validacao-de-conta',
  templateUrl: './smk-validacao-de-conta.component.html',
  styleUrls: ['./smk-validacao-de-conta.component.scss'],
})
export class SmkValidacaoDeContaComponent extends Unsubscriber implements OnInit, AfterViewInit {

  @BlockUI() blockUI: NgBlockUI;

  @ViewChild('codigo') codigoElementRef: ElementRef<HTMLInputElement>;

  @Input() tipo: TipoValidacaoDeConta;
  @Input() novoEmail: string = '';

  @Output() contaValidada: EventEmitter<ResultadoValidacaoDeConta> = new EventEmitter<ResultadoValidacaoDeConta>();

  MetodoValidacaoDeConta = MetodoValidacaoDeConta;

  metodo: MetodoValidacaoDeConta;
  form: FormGroup;
  usuarioLogado: Usuario;
  usuarioUtilizaMfa: boolean;
  titulo: string;
  subTitulo: string;

  configMascaraSomenteNumeros = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: false,
    allowDecimal: false,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 6,
  });

  private emailInicialEnviado: boolean;

  constructor(
    private authService: AutenticacaoService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private validacaoDeContaService: ValidacaoDeContaService,
    private errorService: ErrorService,
  ) {
    super();
  }

  ngOnInit() {
    this.inicialize();
  }

  ngAfterViewInit(): void {
    this.codigoElementRef.nativeElement.focus();
  }

  continue(): void {
    this.blockUI.start();

    let endpointValidacaoDeConta: Observable<boolean>;

    const validacaoDeContaDto = new ValidacaoDeContaDto({ codigo: this.form.get('codigo').value, tipo: this.tipo });

    switch (this.metodo) {
      case MetodoValidacaoDeConta.codigoEmail:
        endpointValidacaoDeConta = this.validacaoDeContaService.valideContaPorEmail(validacaoDeContaDto);
        break;

      case MetodoValidacaoDeConta.codigoPin:
        endpointValidacaoDeConta = this.validacaoDeContaService.valideContaPorMfa(validacaoDeContaDto);
        break;

      case MetodoValidacaoDeConta.codigoRecuperacao:
        endpointValidacaoDeConta = this.validacaoDeContaService.valideContaPorCodigoRecuperacao(validacaoDeContaDto);
        break;
    }

    endpointValidacaoDeConta.pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (contaValidada) => {
          if (contaValidada) {
            this.contaValidada.emit(ResultadoValidacaoDeConta.contaValidada);
          }
        },
        (error) => this.errorService.treatError(error));
  }

  alteraMetodoDeValidacao(metodo: MetodoValidacaoDeConta): void {
    this.metodo = metodo;
    this.processeAlteracaoDoMetodoDeValidacao();
  }

  semAcessoAoMetodoDeAutenticacao(): void {
    const modalRef = this.modalService.open(SmkConfirmacaoComponent, { centered: true, backdrop: 'static' });

    modalRef.componentInstance.titulo = 'Validação de Conta - Sem Acesso';
    modalRef.componentInstance.labelBotaoConfirmar = '';
    modalRef.componentInstance.labelBotaoCancelar = 'Fechar';
    modalRef.componentInstance.conteudo = '';
    modalRef.componentInstance.mensagemAdicional = 'Entre em contato com o suporte para proceder com a configuração do método de autenticação.';

    modalRef.result.then(
      () => { },
      () => this.contaValidada.emit(ResultadoValidacaoDeConta.contaNaoValidada),
    );
  }

  reenviarEmailComCodigo(): void {
    this.enviarEmailComCodigo();
  }

  private inicialize(): void {
    this.usuarioLogado = this.authService.usuario();

    const decodedToken = this.authService.obtenhaTokenDaSessaoDecodificado();

    if (decodedToken) {
      this.usuarioUtilizaMfa = !this.novoEmail && decodedToken.algumaEmpresaUtilizaMfa;
    }

    this.metodo = this.usuarioUtilizaMfa
      ? MetodoValidacaoDeConta.codigoPin
      : MetodoValidacaoDeConta.codigoEmail;

    if (this.metodo === MetodoValidacaoDeConta.codigoEmail) {
      this.enviarEmailInicialComCodigo();
    }

    this.construaForm();
    this.processeAlteracaoDoMetodoDeValidacao();
  }

  private construaForm(): void {
    this.form = this.fb.group({
      codigo: [''],
    });
  }

  private processeAlteracaoDoMetodoDeValidacao(): void {
    let maxLengthCodigo: number = 6;

    switch (this.metodo) {
      case MetodoValidacaoDeConta.codigoEmail:
        this.enviarEmailInicialComCodigo();
        this.titulo = 'Informe o código de verificação:';

        this.subTitulo = this.novoEmail
          ? 'Para manter sua conta segura, enviamos para o novo email informado um código de 6 digítos para confirmar que é um email válido. Informe-o.'
          : 'Veja se você recebeu um código de verificação, que é um número de 6 dígitos, no seu email cadastrado e informe-o.';

        break;

      case MetodoValidacaoDeConta.codigoPin:
        this.titulo = 'Informe o código de confirmação por dois fatores:';
        this.subTitulo = 'Insira o código de autenticação que você vê no aplicativo.';

        break;

      case MetodoValidacaoDeConta.codigoRecuperacao:
        maxLengthCodigo = 8;
        this.titulo = 'Informe um dos códigos de recuperação:';
        this.subTitulo = 'Insira um dos códigos de recuperação que foi apresentado na configuração da autenticação em dois fatores.';

        break;
    }

    const campoCodigo = this.form.get('codigo');

    this.form.reset();

    campoCodigo.clearValidators();

    campoCodigo.setValidators(Validators.compose([
      Validators.required,
      Validators.minLength(maxLengthCodigo),
      Validators.maxLength(maxLengthCodigo),
    ]));
  }

  private enviarEmailInicialComCodigo(): void {
    if (!this.emailInicialEnviado) {
      this.enviarEmailComCodigo();
      this.emailInicialEnviado = true;
    }
  }

  private enviarEmailComCodigo(): void {
    this.blockUI.start();

    this.validacaoDeContaService.processeCodigoVerificacaoPorEmail(new CodigoVerificacaoDto({ tipo: this.tipo, emailNovo: this.novoEmail })).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe({
        error: (error) => this.errorService.treatError(error),
      });
  }

}
