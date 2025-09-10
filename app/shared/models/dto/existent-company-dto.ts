export class ExistentCompanyDto {
  public isExistent: boolean;
  public isBuyer: boolean;
  public isSupplier: boolean;
  public document: string;

  constructor(isExistent?: boolean, isBuyer?: boolean, isSupplier?: boolean, document?: string) {
    this.isExistent = isExistent;
    this.isBuyer = isBuyer;
    this.isSupplier = isSupplier;
    this.document = document;
  }
}
