import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataAlteracao'
})
export class DataAlteracaoPipe implements PipeTransform {

  transform(value: Date): string {
    if (!value) return '';

    const now = new Date();
    const diff = now.getTime() - new Date(value).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) {
      return 'Agora';
    } else if (minutes < 60) {
      return `${minutes} min atrás`;
    } else if (hours < 24) {
      return `${hours}h atrás`;
    } else if (days < 7) {
      return `${days}d atrás`;
    } else {
      return new Date(value).toLocaleDateString('pt-BR');
    }
  }
}