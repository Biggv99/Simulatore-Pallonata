import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonCheers } from './pokemon-cheers';

describe('PokemonCheers', () => {
  let component: PokemonCheers;
  let fixture: ComponentFixture<PokemonCheers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonCheers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonCheers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
