import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Volonteers } from './volonteers';

describe('Volonteers', () => {
  let component: Volonteers;
  let fixture: ComponentFixture<Volonteers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Volonteers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Volonteers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
