export class Guid {
  static validator = new RegExp(
    '^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$',
    'i'
  );

  static EMPTY = '00000000-0000-0000-0000-000000000000';
  private value: string;

  constructor() {
    this.value = [Guid.gen(2), Guid.gen(1), Guid.gen(1), Guid.gen(1), Guid.gen(3)].join('-');
  }

  static isGuid(guid: any) {
    const value: string = guid.toString();
    return guid && (guid instanceof Guid || Guid.validator.test(value));
  }

  toString(): string {
    return this.value;
  }

  private static gen(count: number) {
    let out: string = '';
    for (let i: number = 0; i < count; i++) {
      // tslint:disable-next-line:no-bitwise
      out += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return out;
  }
}
