import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectsComponent } from './collects.component';

describe('CollectsComponent', () => {
  let component: CollectsComponent;
  let fixture: ComponentFixture<CollectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
