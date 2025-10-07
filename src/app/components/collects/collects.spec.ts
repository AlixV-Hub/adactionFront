import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Collects } from './collects';

describe('Collects', () => {
  let component: Collects;
  let fixture: ComponentFixture<Collects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Collects]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Collects);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
