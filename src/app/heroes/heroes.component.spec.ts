import { of } from 'rxjs';
import { HeroesComponent } from './heroes.component';
describe('HerosComponent', () => {
  let fixture: HeroesComponent;
  let heroServiceMock: any;

  beforeEach(() => {
    heroServiceMock = {
      getHeroes: jest.fn(),
      addHero: jest.fn(),
      deleteHero: jest.fn()
    }
    fixture = new HeroesComponent(heroServiceMock);
  })

  describe('ngOnInit', () => {
    it('should call getHeros', () => {
      const getHeroesSpy = jest.spyOn(fixture, 'getHeroes');
      heroServiceMock.getHeroes.mockReturnValue(of([]))
      fixture.ngOnInit();
      expect(getHeroesSpy).toHaveBeenCalled();
    })
  });

  describe('Function testing', () => {
    beforeEach(() => {
      heroServiceMock.getHeroes.mockReturnValue(of([]))
      fixture.ngOnInit();
    });

    describe('add function', () => {
      it('add new not work when name is empty', () => {
        const name = '';
        const addSpy = jest.spyOn(fixture, 'add');
        fixture.add(name);
        expect(addSpy).toHaveBeenCalled();
        expect(heroServiceMock.addHero).not.toHaveBeenCalled();
      });

      it('add new work when name has value', () => {
        const name = 'a new hero';
        const addSpy = jest.spyOn(fixture, 'add');
        const hero = {id: 1, name: name};
        heroServiceMock.addHero.mockReturnValue(of(hero));

        fixture.add(name);
        expect(addSpy).toHaveBeenCalled();
        expect(heroServiceMock.addHero).toHaveBeenCalled();
        expect(fixture.heroes).toEqual([hero]);
      });
    });

    describe('delete Function', () => {
      const name = 'a new hero';
      let hero = {id: 1, name: name};
      beforeEach(() => {
        heroServiceMock.getHeroes.mockReturnValue(of([]))
        fixture.ngOnInit();
        heroServiceMock.addHero.mockReturnValue(of(hero));
        fixture.add(name);
        heroServiceMock.deleteHero.mockReturnValue(of());
      });
      it('should remove hero when hero is found', () => {
        const deleteSpy = jest.spyOn(fixture, 'delete');
        fixture.delete(hero);

        expect(deleteSpy).toHaveBeenCalled();
        expect(fixture.heroes.length).toEqual(0);

      });
      it('should not remove hero when hero is not found', () => {
        const deleteSpy = jest.spyOn(fixture, 'delete');
        hero = {...hero, name:'other'};
        fixture.delete(hero);

        expect(deleteSpy).toHaveBeenCalled();
        expect(fixture.heroes.length).toEqual(1);
      });
    });

        describe('delete Function', () => {
      const name = 'a new hero';
      let hero = {id: 1, name: name};
      beforeEach(() => {
        heroServiceMock.getHeroes.mockReturnValue(of([]))
        fixture.ngOnInit();
        heroServiceMock.addHero.mockReturnValue(of(hero));
        fixture.add(name);
        heroServiceMock.deleteHero.mockReturnValue(of());
      });
      it('should remove hero when hero is found', () => {
        const deleteSpy = jest.spyOn(fixture, 'delete');
        fixture.delete(hero);

        expect(deleteSpy).toHaveBeenCalled();
        expect(fixture.heroes.length).toEqual(0);

      });
      it('should not remove hero when hero is not found', () => {
        const deleteSpy = jest.spyOn(fixture, 'delete');
        hero = {...hero, name:'other'};
        fixture.delete(hero);

        expect(deleteSpy).toHaveBeenCalled();
        expect(fixture.heroes.length).toEqual(1);
      });
    });
  });
})