import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vittima } from './vittima';

describe('Vittima', () => {
  let component: Vittima;
  let fixture: ComponentFixture<Vittima>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vittima]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vittima);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
