import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomNavigationBarClientComponent } from './bottom-navigation-bar-client.component';

describe('BottomNavigationBarClientComponent', () => {
  let component: BottomNavigationBarClientComponent;
  let fixture: ComponentFixture<BottomNavigationBarClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomNavigationBarClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BottomNavigationBarClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
