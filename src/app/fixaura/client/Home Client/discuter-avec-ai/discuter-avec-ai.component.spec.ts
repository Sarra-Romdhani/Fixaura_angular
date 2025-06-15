import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscuterAvecAiComponent } from './discuter-avec-ai.component';

describe('DiscuterAvecAiComponent', () => {
  let component: DiscuterAvecAiComponent;
  let fixture: ComponentFixture<DiscuterAvecAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscuterAvecAiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiscuterAvecAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
