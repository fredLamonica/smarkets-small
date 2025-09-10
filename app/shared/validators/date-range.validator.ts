import { AbstractControl, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

export function dateRangeValidator(minDate: string, maxDate: string = null): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value && control.value.length <= 10) {
      const currentDate = moment(control.value);

      if (currentDate.isBefore(moment(minDate)) || (maxDate && currentDate.isAfter(moment(maxDate)))) {
        return {
          min: {
            date: minDate,
            message: `A data tem que ser maior ou igual a ${moment(minDate).format('DD/MM/YYYY')}`,
          },
          max: {
            date: maxDate,
            message: maxDate ? `A data tem que ser menor ou igual a ${moment(maxDate).format('DD/MM/YYYY')}` : '',
          },
        };
      }
    }

    return null;
  };
}
