import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ExportacaoUsuario } from '@shared/models/exportacao-usuario';
import { ListaPessoaJuridica } from '@shared/models/lista-pessoa-juridica';
import { PessoaJuridicaService, TranslationLibraryService } from '@shared/providers';
import { ExportacaoService } from '@shared/providers/exportacao.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'modal-exportar-permissao',
  templateUrl: './modal-exportar-permissao.component.html',
  styleUrls: ['./modal-exportar-permissao.component.scss']
})
export class ModalExportarPermissaoComponent implements OnInit {

  @Input() idPessoaJuridica: number;

  public form: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  public itens: ListaPessoaJuridica[] = [];
  public itensExportacao: any[] = [];
  public exportacaoUsuario: ExportacaoUsuario = new ExportacaoUsuario();
  public isChecked = false;
  constructor(
    private translationLibrary: TranslationLibraryService,
    private pessoaJuridicaService: PessoaJuridicaService,
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private exportacaoService: ExportacaoService) { }

  ngOnInit() {
    this.form = this.fb.group({
      empresa: [null, Validators.required],
      adiconartodas: [null],
    });

    this.obterPessoasJuridicas();
    this.exportacaoUsuario.idPessoaJuridicaOrigem = this.idPessoaJuridica;
    this.exportacaoUsuario.idsPessoaJuridicaDestino = [];
  }

  private obterPessoasJuridicas() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pessoaJuridicaService.obterCompradoresExceto(this.idPessoaJuridica).subscribe(
      result => {
        this.blockUI.stop();
        this.itens = result;
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  onConfirm() {
    if (this.itensExportacao && this.itensExportacao.length > 0) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);

      this.exportacaoUsuario.idsPessoaJuridicaDestino = [];
      this.itensExportacao.forEach(f => {
        this.exportacaoUsuario.idsPessoaJuridicaDestino.push(f.idPessoaJuridica);
      });

      this.exportacaoService
        .inserir(this.exportacaoUsuario)
        .subscribe((result) => {
          this.activeModal.close();
          this.blockUI.stop();
          this.toastr.success("Exportação realizada com sucesso!");
        }, (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        });
    } else {
      this.toastr.error("Necessário selecinar ao menos uma empresa para exportar os usuários.");
    }
  }

  add() {
    this.addPessoaJuridica(this.form.value.empresa);

    this.form.controls["empresa"].setValue(null);
  }

  private addPessoaJuridica(idPessoaJuridica: number) {
    if (this.itensExportacao.some(s => s.idPessoaJuridica == idPessoaJuridica) === false) {
      let result = this.itens.filter(f => f.idPessoaJuridica == idPessoaJuridica);

      if (result && result.length > 0) {
        this.itensExportacao.push(result[0]);
      }
    }
  }

  remove(idPessoaJuridica: number) {
    let index = this.itensExportacao.indexOf(idx => idx.idPessoaJuridica == idPessoaJuridica);
    this.itensExportacao.splice(index, 1);
  }

  selectAll(value: any) {
    if (value) {
      this.itens.forEach(f => {
        this.addPessoaJuridica(f.idPessoaJuridica);
      });
    }
  }
}