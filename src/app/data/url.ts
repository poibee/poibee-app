export class Url {

  private constructor(public readonly value: string) {
  }

  static of(text: string): Url {
    if (text === undefined) {return undefined;}
    if (text === null) {return null;}

    const schemaExist = ['http://', 'https://'].find(schema => text.startsWith(schema));
    return new Url(schemaExist ? text : 'http://' + text);
  }

  toString = (): string => this.value;

}
