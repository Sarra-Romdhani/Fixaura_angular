import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBarHomeComponent } from './top-bar-home.component';

describe('TopBarHomeComponent', () => {
  let component: TopBarHomeComponent;
  let fixture: ComponentFixture<TopBarHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopBarHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopBarHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
