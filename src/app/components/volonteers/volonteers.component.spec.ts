import { TestBed } from '@angular/core/testing';
import { VolonteersComponent } from './volonteers.component'; // <-- ici le bon chemin
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('VolonteersComponent', () => {
  let component: VolonteersComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, VolonteersComponent], // standalone component
    }).compileComponents();

    const fixture = TestBed.createComponent(VolonteersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
