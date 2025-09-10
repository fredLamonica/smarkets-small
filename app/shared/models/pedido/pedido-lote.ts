import { Pedido } from "./pedido";
import { Usuario } from "../usuario";

export class PedidoLote {
  public idPedidoLote: number;
  public idUsuarioSolicitante: number;
  public idTenant: number;
  public codigo: number;
  public situacao: number;
  public dataInclusao: string;
  public pedidos: Array<Pedido>;
  public usuarioSolicitante: Usuario; 
}