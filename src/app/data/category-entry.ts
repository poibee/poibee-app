export class CategoryEntry {

  mainCategory: CategoryEntry;

  constructor(public key: string, public label: string, public children: CategoryEntry[] = []) {
    this.mainCategory = this;
    children.forEach(child => child.mainCategory = this);
  }

  image() {
    return 'assets/category/' + this.key + '.png'
  }
}
