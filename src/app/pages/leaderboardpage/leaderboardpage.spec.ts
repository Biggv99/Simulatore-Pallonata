import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leaderboardpage } from './leaderboardpage';

describe('Leaderboardpage', () => {
  let component: Leaderboardpage;
  let fixture: ComponentFixture<Leaderboardpage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leaderboardpage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Leaderboardpage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
