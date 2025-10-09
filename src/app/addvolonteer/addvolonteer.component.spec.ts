import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddVolonteerComponent } from './addvolonteer.component';

describe('AddVolonteerComponent', () => {
  let component: AddVolonteerComponent;
  let fixture: ComponentFixture<AddVolonteerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVolonteerComponent] // 
    }).compileComponents();

    fixture = TestBed.createComponent(AddVolonteerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
