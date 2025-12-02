import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Palla } from './palla';

describe('Palla', () => {
  let component: Palla;
  let fixture: ComponentFixture<Palla>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Palla]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Palla);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
