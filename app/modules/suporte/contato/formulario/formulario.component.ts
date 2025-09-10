import { Component, OnInit } from '@angular/core';
import { Formulario } from '../../models/formulario';
import { FormularioService } from '../../providers/formulario/formulario.service';
import { ToastrService } from 'ngx-toastr';
import { stringify } from '@angular/core/src/util';
import { TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public form = new Formulario('', '', new Array());

  constructor(
    private service: FormularioService,
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService
  ) {}

  ngOnInit() {}

  onChange(event: any) {
    const selectedAnexos = <FileList>event.srcElement.files;
    event.srcElement.files = null;
    for (let i = 0; i < selectedAnexos.length; ++i) {
      this.form.anexos.push(selectedAnexos[i]);
    }
  }

  onSend() {
    if (this.form.titulo.trim() && this.form.descricao.trim()) {
      this.blockUI.start();
      this.service.send(this.form.titulo, this.form.descricao, this.form.anexos).subscribe(
        res => {
          if (res) {
            this.form.limparCampos();
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          }
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }
}
