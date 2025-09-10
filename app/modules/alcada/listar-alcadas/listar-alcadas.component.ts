import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { PerfilUsuario, Usuario } from '@shared/models';
import { AutenticacaoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Alcada } from '../../../shared/models/alcada';
import { AlcadaFiltro } from '../../../shared/models/fltros/alcadas-filtro';
import { AlcadaService } from '../../../shared/providers/alcada.service';
import { ErrorService } from '../../../shared/utils/error.service';

@Component({
  selector: 'app-listar-alcadas',
  templateUrl: './listar-alcadas.component.html',
  styleUrls: ['./listar-alcadas.component.scss'],
})
export class ListarAlcadasComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  currentUser: Usuario;
  alcadas: Array<Alcada> = new Array<Alcada>();
  alcadaFiltro: AlcadaFiltro;
  selectionEnabled: boolean = false;
  statusOptions = [
    { label: 'Ativa' },
    { label: 'Inativa' },
  ];

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AutenticacaoService,
    private alcadaService: AlcadaService,
    private errorService: ErrorService,
  ) {
    super();
  }

  ngOnInit() {
    this.currentUser = this.authService.usuario();
    this.buildFilter();
    this.getAlcadas();
  }

  getAlcadas() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.alcadaService.filtrar(this.alcadaFiltro).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.alcadas = response.itens;
            this.alcadaFiltro.totalPaginas = response.numeroPaginas;
          } else {
            this.alcadaFiltro.pagina = 1;
            this.alcadaFiltro.totalPaginas = 0;
          }

          this.blockUI.stop();
        },
        (error) => {
          if (error.error) {
            error.error.forEach((e) => {
              this.toastr.warning(e.message);
            });
          } else {
            this.errorService.treatError(error);
          }
          this.blockUI.stop();
        },
      );
  }

  page(event) {
    this.alcadaFiltro.pagina = event.page;
    this.alcadaFiltro.itensPorPagina = event.recordsPerPage;
    this.getAlcadas();
  }

  usuarioPodeIncluirAlcada(): boolean {
    return this.currentUser.permissaoAtual.perfil === PerfilUsuario.Administrador || this.currentUser.permissaoAtual.perfil === PerfilUsuario.Gestor ||
      this.currentUser.permissaoAtual.perfil === PerfilUsuario.Cadastrador || this.currentUser.permissaoAtual.perfil === PerfilUsuario.Aprovador;
  }

  incluirAlcada() {
    this.router.navigate(['./../novo'], {
      relativeTo: this.route,
    });
  }

  private buildFilter(): void {
    this.alcadaFiltro = new AlcadaFiltro();
    this.alcadaFiltro.pagina = 1;
    this.alcadaFiltro.itensPorPagina = 5;
    this.alcadaFiltro.totalPaginas = 0;
  }
}
