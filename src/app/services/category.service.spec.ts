import {CategoryService} from "./category.service";

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(() => {
    service = new CategoryService();
  });

  it('should give main categories', () => {
    expect(service.all().length).toBe(8);
    expect(service.all()[0].label).toBe('Alles');
    expect(service.all()[1].label).toBe('Einrichtung');
    expect(service.all()[2].label).toBe('Historisch');
    expect(service.all()[3].label).toBe('Freizeit');
  });

  it('should give concrete categories', () => {
    expect(service.concreteCategories().length).toBe(82);
    expect(service.concreteCategories()[0].label).toBe('Restaurant');
    expect(service.concreteCategories()[1].label).toBe('Bank');
    expect(service.concreteCategories()[2].label).toBe('Briefkasten');
    expect(service.concreteCategories()[3].label).toBe('Eisdiele');
  });

  it('should give favorite categories', () => {
    expect(service.favoriteCategories().length).toBe(9);
    expect(service.favoriteCategories()[0].label).toBe('Attraktion');
    expect(service.favoriteCategories()[1].label).toBe('Bäcker');
    expect(service.favoriteCategories()[2].label).toBe('Parkbank');
    expect(service.favoriteCategories()[3].label).toBe('Kino');
    expect(service.favoriteCategories()[8].label).toBe('Alles');
  });

  it('should give the all category', () => {
    expect(service.allCategory().label).toBe('Alles');
  });

  it('should give category of key', () => {
    expect(service.ofKey('all').label).toBe('Alles');
    expect(service.ofKey('shop').label).toBe('Geschäft');
    expect(service.ofKey('restaurant').label).toBe('Restaurant');
  });
});
