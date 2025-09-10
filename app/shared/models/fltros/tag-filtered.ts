export class TagFiltered {
  public name: string;
  public label: string;
  public values: TagFilteredValue[] = [];

  constructor(name: string) {
    this.name = name;
    this.values = [];
  }

  public add(value: TagFilteredValue[] | TagFilteredValue) {
    this.values = this.values.concat(value);
  }

  public removeValue(value: TagFilteredValue): void {
    if (this.values) {
      let index = this.values.indexOf(value);

      if (index !== -1) {
        this.values.splice(index, 1);
      }
    }
  }

  public removeValues(values: TagFilteredValue[]) {
    for (let value of values) {
      this.removeValue(value);
    }
  }

  public clear() {
    this.values = [];
  }

  public containsValue(filterValue: TagFilteredValue): boolean {
    return this.values.some(p => p.label === filterValue.label && p.value === filterValue.value);
  }
}

export class TagFilteredValue {
  public label: string;
  public value: any;

  constructor(label: any, value: any) {
    this.label = label;
    this.value = value;
  }
}
