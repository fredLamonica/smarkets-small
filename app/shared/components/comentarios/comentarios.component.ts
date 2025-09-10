import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Usuario } from '@shared/models';
import { AutenticacaoService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { Comentario } from './../../models/interfaces/comentario';

@Component({
  selector: 'comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss']
})
export class ComentariosComponent implements OnInit {

  @Input() comentarios: Array<Comentario>;
  @Input() placeholder: string = "Adicione um novo comentário.";
  @Input() titulo: string = "Comentários";
  @Input() prefixoSubTitulo: string = "Último comentário";
  @Input() readOnly: boolean;
  @Input() quantidadeDeCaracteres: number;

  @Output('enviar') addComentarioEmitter = new EventEmitter();

  public comentario: string;

  public usuarioLogado: Usuario;

  constructor(
    private autenticacaoService: AutenticacaoService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.usuarioLogado = this.autenticacaoService.usuario();
  }

  public getInitials(nome: any) {
    let initials = nome.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    return initials.toUpperCase();
  }

  public salvarComentario() {
    if (this.comentario && this.comentario.trim() != "") {
      this.addComentarioEmitter.emit(this.comentario);
    } else {
      this.toastr.warning("Não é permitido enviar um comentário vazio");
    }
    this.comentario = "";
  }
}
