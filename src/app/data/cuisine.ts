export class Cuisine {

  private constructor(
    public readonly values: string[]
  ) {
  }

  isPresent(): boolean {
    return this.values.length > 0;
  }

  previewValue(): string {
    let result = '';
    if (this.values.length > 0) {
      result += this.values[0];
    }
    if (this.values.length > 1) {
      result += ', ...';
    }
    return result;
  }

  completeValue(): string {
    let result = '';
    if (this.values.length > 0) {
      result = this.values.join(', ');
    }
    return result;
  }

  static of(values: string): Cuisine {
    let result = [];
    if (values) {
      result = values.split(';').map((v) => this.normalizeCuisineString(v)).sort((a, b) => a.localeCompare(b));
    }
    return new Cuisine(result);
  }

  private static normalizeCuisineString(value: string) {
    return value.replace('_', ' ').split(' ').map((v) => this.capitalizeString(v)).join(' ');
  }

  private static capitalizeString(value: string) {
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
  }

}
