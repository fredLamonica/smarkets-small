import { Usuario } from '../usuario';

export class Log<T = {}> {
  public dataInclusao: string;
  public descricao: string;
  public usuario: Usuario;
  public model: T;
}

export function deserialize<T>(log: Log<T>): Log<T> {
  log.model = log.model != null ? JSON.parse(log.model.toString()) : null;
  return log;
}
