import { HeroService } from './../hero.service';
import { HttpClientModule } from '@angular/common/http';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { HeroesComponent } from './heroes.component';
import { By } from '@angular/platform-browser';
describe('HerosComponent', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;
  let heroServiceMock: any;

  beforeEach(() => {
    heroServiceMock = {
      getHeroes: jest.fn(),
      addHero: jest.fn(),
      deleteHero: jest.fn(),
    };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule, HttpClientModule],
      declarations: [HeroesComponent],
      providers: [{ provide: HeroService, useValue: heroServiceMock }],
    }).compileComponents();

    heroServiceMock.getHeroes.mockReturnValue(of([]));
    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('DOM testing', () => {
    it('should be created', () => {
      expect(component).toBeTruthy();
    });
    describe('hero button', () => {
      let addHeroButton: DebugElement;
      beforeEach(() => {
        addHeroButton = fixture.debugElement.query(By.css('button.add-button'));
      });

      it('should have add hero button', () => {
        expect(addHeroButton).not.toBeNull();
      });
      it('should invoke add function when trigger button add hero', () => {
        const addSpy = spyOn(component, 'add');
        addHeroButton.nativeElement.click();
        expect(addSpy).toHaveBeenCalled();
      });
    });
  });

  describe('snapshot of markup', () => {
    it('should match the markup for a item', () => {
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
    });
  });

  describe('ngOnInit', () => {
    it('should call getHeros', () => {
      const getHeroesSpy = jest.spyOn(component, 'getHeroes');
      heroServiceMock.getHeroes.mockReturnValue(of([]));
      component.ngOnInit();
      expect(getHeroesSpy).toHaveBeenCalled();
    });
  });

  describe('Function testing', () => {
    beforeEach(() => {
      heroServiceMock.getHeroes.mockReturnValue(of([]));
      component.ngOnInit();
    });

    describe('add function', () => {
      it('add new not work when name is empty', () => {
        const name = '';
        const addSpy = jest.spyOn(component, 'add');
        component.add(name);
        expect(addSpy).toHaveBeenCalled();
        expect(heroServiceMock.addHero).not.toHaveBeenCalled();
      });

      it('add new work when name has value', () => {
        const name = 'a new hero';
        const addSpy = jest.spyOn(component, 'add');
        const hero = { id: 1, name: name };
        heroServiceMock.addHero.mockReturnValue(of(hero));

        component.add(name);
        expect(addSpy).toHaveBeenCalled();
        expect(heroServiceMock.addHero).toHaveBeenCalled();
        expect(component.heroes).toEqual([hero]);
      });
    });

    describe('delete Function', () => {
      const name = 'a new hero';
      let hero = { id: 1, name: name };
      beforeEach(() => {
        heroServiceMock.getHeroes.mockReturnValue(of([]));
        component.ngOnInit();
        heroServiceMock.addHero.mockReturnValue(of(hero));
        component.add(name);
        heroServiceMock.deleteHero.mockReturnValue(of());
      });
      it('should remove hero when hero is found', () => {
        const deleteSpy = jest.spyOn(component, 'delete');
        component.delete(hero);

        expect(deleteSpy).toHaveBeenCalled();
        expect(component.heroes.length).toEqual(0);
      });
      it('should not remove hero when hero is not found', () => {
        const deleteSpy = jest.spyOn(component, 'delete');
        hero = { ...hero, name: 'other' };
        component.delete(hero);

        expect(deleteSpy).toHaveBeenCalled();
        expect(component.heroes.length).toEqual(1);
      });
    });
    
    describe('Get amount hero return function', () => {
      const name = 'a new hero';
      let hero = { id: 1, name: name };
      beforeEach(() => {
        heroServiceMock.getHeroes.mockReturnValue(of([]));
        component.ngOnInit();
        heroServiceMock.addHero.mockReturnValue(of(hero));
      });
      it('should return 0 when init', () => {
        expect(component.getAmountHero()).toEqual(0);
      });
    });

    describe('setTimeout Function', () => {
      const name = 'a new hero';
      let hero = { id: 1, name: name };
      beforeEach(() => {
        heroServiceMock.getHeroes.mockReturnValue(of([]));
        component.ngOnInit();

        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.clearAllTimers();
      });

      it('should waiting the timeout', () => {
        component.addHeroByTimeOut(hero);
        jest.runOnlyPendingTimers();
        expect(component.heroes.length).toBeGreaterThan(0);
      });

      it('should not add the hero before 3 seconds', () => {
        component.addHeroByTimeOut(hero);
        jest.advanceTimersByTime(2999);
        expect(component.heroes.length).toEqual(0);
      });

      it('should add the hero after 3 seconds', () => {
        component.addHeroByTimeOut(hero);
        jest.advanceTimersByTime(3001);
        expect(component.heroes.length).toBeGreaterThan(0);
      });
    });

    describe('Promise function', () => {
      it('should be return resolve when name is correct', () => {
        return expect(component.getNameByPromise('Nghia')).resolves.toEqual('Nghia Ngo')
      });

      it('should be return reject when name is not correct', () => {
        return expect(component.getNameByPromise('someone')).rejects.toEqual('Poor you');
      });
    });

    describe('Promise function with asyn/await', () => {
      it('should be return resolve when name is correct', async () => {
        await expect(component.getNameByPromiseAsyncAwait('Nghia')).resolves.toEqual('Nghia Ngo')
      });

      it('should be return reject when name is not correct', async () => {
        await expect(component.getNameByPromiseAsyncAwait('someone')).rejects.toEqual('Poor you');
      });
    });
  });
});
