export class DynamicFilter {
  //ex model Pessoa

  public propertyName: string; // ex property name in filterDto (ex pessoas)
  public type: DynamicFilterType; // ex Select
  public placeholder: string; // ex Pessoas
  public filterColumnSize: number; //ex 2
  public listOptionLabel: string; // ex nome
  public listOptionValue: string; // ex idPessoa
  public listOptions: any[]; // ex Pessoas [Pessoa(1,'g'), Pessoa(2, 'a)]

  constructor(
    propertyName: string,
    type: DynamicFilterType,
    placeholder: string,
    filterColumnSize: number = 1,
    listOptionLabel: string = null,
    listOptionValue: string = null,
    listOptions: any[] = null
  ) {
    this.propertyName = propertyName;
    this.type = type;
    this.listOptions = listOptions;
    this.listOptionLabel = listOptionLabel;
    this.listOptionValue = listOptionValue;
    this.placeholder = placeholder;
    this.filterColumnSize = filterColumnSize;
  }
}

export class EnumKeyValue {
  public name: string;
  public value: any;
  public label: string;
}

export enum DynamicFilterType {
  Text = 1,
  Select = 2,
  Multiselect = 3
}
