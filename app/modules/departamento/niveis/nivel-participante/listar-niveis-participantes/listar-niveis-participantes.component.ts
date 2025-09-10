import { Component, OnInit, Input } from '@angular/core';
import { ManterNivelParticipanteComponent } from '../manter-nivel-participante/manter-nivel-participante.component';
import { ModalConfirmacaoExclusao } from '@shared/components';
import { NivelParticipante, CustomTableColumnType, CustomTableColumn, CustomTableSettings } from '@shared/models';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TranslationLibraryService, DepartamentoService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'listar-niveis-participantes',
  templateUrl: './listar-niveis-participantes.component.html',
  styleUrls: ['./listar-niveis-participantes.component.scss']
})
export class ListarNiveisParticipantesComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  @Input('id-nivel') idNivel: number;
  @Input('id-nivel-participante') idNivelparticipante: number;

  //public Situacao = Situacao;

  public settings: CustomTableSettings;
  public niveisParticipantes: Array<NivelParticipante>;
  public niveisParticipantesSelecionados: Array<NivelParticipante>;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private departamentoService: DepartamentoService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.construirTabelas();
    this.obterNiveisParticipantes();
  }

  public construirTabelas() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn("Participante", "usuario.pessoaFisica.nome", CustomTableColumnType.text),
        new CustomTableColumn("Ordem", "ordem", CustomTableColumnType.text),
      ], "check"
    );
  }

  private obterNiveisParticipantes() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.departamentoService.obterNivelParticipantePorNivel(this.idNivel).subscribe(
      response => {
        if (response) {
          this.niveisParticipantes = response;
        }
        this.blockUI.stop();
      }, error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public selecao(itens: Array<NivelParticipante>) {
    this.niveisParticipantesSelecionados = itens;
  }

  // #region Deleção
  public solicitarExclusao() {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      result => this.excluir(),
      reason => { }
    );
  }

  private excluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.departamentoService.deletaNiveisParticipantesBatch(this.idNivel, this.niveisParticipantesSelecionados).subscribe(resultado => {
      this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      this.blockUI.stop();
      this.obterNiveisParticipantes();
    }, error => {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    });
  }
  // #endregion

  //#region  Modal Manter Nível Participante

  private criaModalNivelParticipante(): NgbModalRef {
    return this.modalService.open(ManterNivelParticipanteComponent, { centered: true });
  }

  private abreModalNivelParticipante(modalRef: NgbModalRef){
    modalRef.componentInstance.idNivel = this.idNivel;
    modalRef.componentInstance.niveisParticipantes = this.niveisParticipantes;
    modalRef.result.then(
      result => {
        if (result) {
          this.obterNiveisParticipantes();
        }
      }
    );
  }

  public novoNivelParticipante(){
    let modalRef = this.criaModalNivelParticipante();
    this.abreModalNivelParticipante(modalRef);
  }
  
  public manterNivelParticipante() {
    let modalRef = this.criaModalNivelParticipante();
    if (this.niveisParticipantes && this.niveisParticipantesSelecionados.length){
      modalRef.componentInstance.idNivelParticipante = this.niveisParticipantesSelecionados[0].idNivelParticipante;
    }

    this.abreModalNivelParticipante(modalRef);
  }

  // #endregion

}
