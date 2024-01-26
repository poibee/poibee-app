export class Contact {

  constructor(
    public readonly name: string,
    public readonly address: string,
    public readonly phone: string,
    public readonly fax: string,
    public readonly email: string,
    public readonly website: string
  ) {
  }

  static of(name: string): Contact {
    return new Contact(name, null, null, null, null, null);
  }
}
