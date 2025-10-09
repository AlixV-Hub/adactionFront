import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addvolonteer.component } from './addvolonteer.component';

describe('Addvolonteer', () => {
  let component: Addvolonteer;
  let fixture: ComponentFixture<Addvolonteer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addvolonteer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addvolonteer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
