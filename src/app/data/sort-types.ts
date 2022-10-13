export enum SortTypes {

  distance = 'Entfernung',
  name = 'Name',
  relevance = 'Relevanz',
  category = 'Kategorie',
}

export function sortTypesAsArray(): [string, string][] {
  const keys = Object.keys(SortTypes).filter((item) => {
    return isNaN(Number(item));
  });
  return keys.map(k => [k, SortTypes[k]]);
}
