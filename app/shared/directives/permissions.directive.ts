import { Directive, Input, OnInit, TemplateRef, ViewContainerRef, OnChanges, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { AutenticacaoService } from '@shared/providers';
import { PerfilUsuario } from '@shared/models';

//#region Modo de uso

//- Only granted roles
//*permissionsOnly="'fornecedor'" ou *permissionsOnly="['fornecedor', 'requisitante']"
//- All roles except   
//*permissionsExcept="'fornecedor'" ou *permissionsExcept="['fornecedor', 'fornecedor']"

//#endregion

@Directive({ selector: '[permissionsOnly], [permissionsExcept]' })
export class PermissionsDirective implements OnInit, OnChanges {
  constructor(
    private templateRef: TemplateRef<any>,
    private autenticacaoService: AutenticacaoService,
    private viewContainer: ViewContainerRef
  ) { }

  private check = new Subject<boolean>();

  ngOnInit() {
    this.check.subscribe(
      (check) => {
        this.verifyPermissions();
        if (check && this.hasPermission || !check && !this.hasPermission) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      }
    )

    this.check.next(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.check.next(true);
  }

  private _permissionsOnly: string | Array<string> | any;
  private _permissionsExcept: string | Array<string> | any;

  @Input() set permissionsOnly(value) {
    if(value instanceof Array || typeof value === 'string') {
      this._permissionsOnly = {
        permissions: value,
        opts: { extra: true }
      };
    } else {
      this._permissionsOnly = value;
    }
  }

  @Input() set permissionsExcept(value) {
    if(value instanceof Array || typeof value === 'string') {
      this._permissionsExcept = {
        permissions: value,
        opts: { extra: true }
      };
    } else {
      this._permissionsExcept = value;
    }
  }

  private hasPermission: boolean = false;

  private verifyPermissions() {
    if (this._permissionsOnly && (this._permissionsOnly.permissions || (this._permissionsOnly.permissions && this._permissionsOnly.permissions.length)))
      this.verifyPermissionsOnly();

    if (this._permissionsExcept && (this._permissionsExcept.permissions || (this._permissionsExcept.permissions && this._permissionsExcept.permissions.length)))
      this.verifyPermissionsExcept();
  }

  private verifyPermissionsOnly() {
    let currentProfile = PerfilUsuario[this.autenticacaoService.perfil()];
    this.hasPermission = this._permissionsOnly.permissions.includes(currentProfile) && this._permissionsOnly.opts.extra;
  }

  private verifyPermissionsExcept() {
    let currentProfile = PerfilUsuario[this.autenticacaoService.perfil()];
    this.hasPermission = !this._permissionsExcept.permissions.includes(currentProfile) && this._permissionsExcept.opts.extra;
  }

}