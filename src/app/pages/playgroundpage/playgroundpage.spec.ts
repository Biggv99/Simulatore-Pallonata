import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Playgroundpage } from './playgroundpage';

describe('Playgroundpage', () => {
  let component: Playgroundpage;
  let fixture: ComponentFixture<Playgroundpage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Playgroundpage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Playgroundpage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
