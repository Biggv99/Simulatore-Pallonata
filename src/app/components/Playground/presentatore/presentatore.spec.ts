import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Presentatore } from './presentatore';

describe('Presentatore', () => {
  let component: Presentatore;
  let fixture: ComponentFixture<Presentatore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Presentatore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Presentatore);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
