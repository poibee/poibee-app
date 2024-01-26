import {Injectable} from '@angular/core';
import {CategoryEntry} from '../data/category-entry';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categoryMap: Map<string, CategoryEntry>;

  constructor() {
    this.categoryMap = new Map<string, CategoryEntry>();
    ALL_CATEGORIES.forEach(category => {
      this.categoryMap.set(category.key, category);
      category.children.forEach(categoryChild => {
        this.categoryMap.set(categoryChild.key, categoryChild);
      });
    });
  }

  all(): CategoryEntry[] {
    return ALL_CATEGORIES;
  }

  concreteCategories(): CategoryEntry[] {
    const result = [];
    ALL_CATEGORIES.forEach(category => {
      category.children.forEach(concreteCategory => {
        result.push(concreteCategory);
      });
    });
    return result;
  }

  favoriteCategories(): CategoryEntry[] {
    const favoriteCategoryKeys = ['attraction', 'bakery', 'bench', 'cinema', 'fuel', 'playground', 'restaurant', 'zoo', 'all'];
    return favoriteCategoryKeys.map(c => this.ofKey(c));
  }

  ofKey(key: string): CategoryEntry {
    return this.categoryMap.get(key);
  }

  allCategory(): CategoryEntry {
    return ALL_CATEGORIES[0];
  }
}

const ALL_CATEGORIES = [
  new CategoryEntry('all', 'Alles', []),
  new CategoryEntry('amenity', 'Einrichtung', [
    new CategoryEntry('restaurant', 'Restaurant'),
    new CategoryEntry('bank', 'Bank'),
    new CategoryEntry('postbox', 'Briefkasten'),
    new CategoryEntry('icecream', 'Eisdiele'),
    new CategoryEntry('hunting', 'Hochsitz'),
    new CategoryEntry('cinema', 'Kino'),
    new CategoryEntry('church', 'Kirche'),
    new CategoryEntry('bench', 'Parkbank'),
    new CategoryEntry('fuel', 'Tankstelle'),
    new CategoryEntry('shelter', 'Unterstand'),
    new CategoryEntry('parking', 'Parkplatz'),
    new CategoryEntry('barbecue', 'Grillplatz'),
    new CategoryEntry('school', 'Schule'),
    new CategoryEntry('kindergarten', 'Kindergarten'),
    new CategoryEntry('childcare', 'Tagesbetreuung'),
    new CategoryEntry('dentist', 'Zahnarzt'),
    new CategoryEntry('library', 'Bücherei'),
    new CategoryEntry('toilets', 'Toilette'),
    new CategoryEntry('vendor', 'Automat'),
    new CategoryEntry('theater', 'Theater'),
    new CategoryEntry('taxi', 'Taxi'),
    new CategoryEntry('police', 'Polizei'),
    new CategoryEntry('hospital', 'Krankenhaus'),
    new CategoryEntry('socialfacility', 'Soziale Einrichtung'),
    new CategoryEntry('fountain', 'Brunnen'),
    new CategoryEntry('bicycleparking', 'Fahrrad Parkplatz'),
    new CategoryEntry('busstation', 'Busbahnhof'),
    new CategoryEntry('firestation', 'Feuerwehr'),
    new CategoryEntry('recycling', 'Recycling'),
    new CategoryEntry('doctor', 'Arzt'),
    new CategoryEntry('pharmacy', 'Apotheke'),
    new CategoryEntry('telephone', 'Telefon'),
    new CategoryEntry('clock', 'Uhr'),
    new CategoryEntry('veterinary', 'Tierarzt'),
    new CategoryEntry('carwash', 'Waschanlage')
  ]),
  new CategoryEntry('historic', 'Historisch', [
    new CategoryEntry('castle', 'Burg'),
    new CategoryEntry('memorial', 'Denkmal'),
    new CategoryEntry('megalith', 'Archäologisch'),
    new CategoryEntry('ruins', 'Ruine')
  ]),
  new CategoryEntry('leisure', 'Freizeit', [
    new CategoryEntry('playground', 'Spielplatz'),
    new CategoryEntry('swimming', 'Schwimmbad'),
    new CategoryEntry('park', 'Park')
  ]),
  new CategoryEntry('man_made', 'Bauwerk', [
    new CategoryEntry('lighthouse', 'Leuchtturm'),
    new CategoryEntry('watermill', 'Wassermühle'),
    new CategoryEntry('mast', 'Mast'),
    new CategoryEntry('exchange', 'Verteiler')
  ]),
  new CategoryEntry('shop', 'Geschäft', [
    new CategoryEntry('bakery', 'Bäcker'),
    new CategoryEntry('kiosk', 'Kiosk'),
    new CategoryEntry('supermarket', 'Supermarkt'),
    new CategoryEntry('hairdresser', 'Frisör'),
    new CategoryEntry('butcher', 'Schlachter'),
    new CategoryEntry('photo', 'Fotograf'),
    new CategoryEntry('gift', 'Geschenke'),
    new CategoryEntry('optician', 'Optiker'),
    new CategoryEntry('florist', 'Garten/Florist'),
    new CategoryEntry('shoes', 'Schuhe'),
    new CategoryEntry('electronic', 'Elektronik'),
    new CategoryEntry('clothes', 'Kleidung'),
    new CategoryEntry('travel', 'Reisebüro'),
    new CategoryEntry('convenience', 'Täglicher Bedarf'),
    new CategoryEntry('bicycle', 'Fahrrad'),
    new CategoryEntry('hearingaids', 'Hörgeräte'),
    new CategoryEntry('car', 'Autohaus/Reparatur'),
    new CategoryEntry('beverage', 'Getränkehandel'),
    new CategoryEntry('farm', 'Hofladen'),
    new CategoryEntry('pet', 'Tierhandlung'),
    new CategoryEntry('motorcycle', 'Motorrad'),
    new CategoryEntry('doityourself', 'Baumarkt'),
    new CategoryEntry('chemist', 'Drogerie'),
    new CategoryEntry('healthfood', 'Reformhaus')
  ]),
  new CategoryEntry('sport', 'Sport', [
    new CategoryEntry('climbing', 'Klettern'),
    new CategoryEntry('bowling', 'Bowling'),
    new CategoryEntry('iceskating', 'Eislaufen')
  ]),
  new CategoryEntry('tourism', 'Touristik', [
    new CategoryEntry('attraction', 'Attraktion'),
    new CategoryEntry('camping', 'Camping'),
    new CategoryEntry('hotel', 'Hotel'),
    new CategoryEntry('information', 'Information'),
    new CategoryEntry('museum', 'Museum'),
    new CategoryEntry('picnic', 'Picknick'),
    new CategoryEntry('themepark', 'Freizeitpark'),
    new CategoryEntry('viewpoint', 'Aussichtspunkt'),
    new CategoryEntry('zoo', 'Zoo')
  ])
];
